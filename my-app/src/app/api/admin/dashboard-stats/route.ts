import { auth } from "@/auth";
import connectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const totalVendors = await UserModel.countDocuments({ role: "vendor" });
    const pendingVendors = await UserModel.countDocuments({
      role: "vendor",
      shopVerificationStatus: "pending",
    });
    const totalProducts = await productModel.countDocuments({});
    const pendingProducts = await productModel.countDocuments({
      productVerificationStatus: "pending",
    });
    const totalOrders = await OrderModel.countDocuments({});
    const earningsData = await OrderModel.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalEarnings = earningsData[0]?.total || 0;
    const statusRaw = await OrderModel.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);
    const statusData = statusRaw.map((s) => ({ name: s._id, value: s.count }));
    const vendorRaw = await OrderModel.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.vendor", orders: { $sum: 1 } } },
      { $sort: { orders: -1 } },
      { $limit: 5 },
    ]);
    const vendorData = await Promise.all(
      vendorRaw.map(async (v) => {
        const vendor = await UserModel.findOne({ _id: v._id }).select(
          "shopName",
        );
        return {
          name: vendor?.shopName || "Unknown Vendor",
          orders: v.orders,
        };
      }),
    );
    return NextResponse.json(
      {
        summary: {
          totalVendors,
          pendingVendors,
          totalProducts,
          pendingProducts,
          totalOrders,
          totalEarnings,
        },
        charts: {
          statusData,
          vendorData,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
