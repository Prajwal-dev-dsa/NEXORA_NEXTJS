import { auth } from "@/auth";
import connectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import productModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || session.user.role !== "vendor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const vendorId = session.user.id;
    const totalProducts = await productModel.countDocuments({
      vendor: vendorId,
    });
    const activeProducts = await productModel.countDocuments({
      vendor: vendorId,
      isActive: true,
    });
    const orderStats = await OrderModel.aggregate([
      { $unwind: "$items" },
      { $match: { "items.vendor": vendorId } },
      {
        $group: {
          _id: null,
          totalOrders: { $addToSet: "$_id" }, // Count unique order IDs
          totalRevenue: {
            $sum: {
              $cond: [
                { $ne: ["$orderStatus", "Cancelled"] },
                { $multiply: ["$items.price", "$items.quantity"] },
                0,
              ],
            },
          },
          pendingOrders: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "Processing"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          totalOrders: { $size: "$totalOrders" },
          totalRevenue: 1,
          pendingOrders: 1,
        },
      },
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
    };
    const revenueTrendRaw = await OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.vendor": vendorId,
          orderStatus: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    const lineChartData = revenueTrendRaw.map((r) => ({
      date: r._id,
      revenue: r.revenue,
    }));
    const topProductsRaw = await OrderModel.aggregate([
      { $unwind: "$items" },
      { $match: { "items.vendor": vendorId } },
      {
        $group: {
          _id: "$items.product",
          sales: { $sum: "$items.quantity" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);

    const barChartData = await Promise.all(
      topProductsRaw.map(async (p) => {
        const product = await productModel.findById(p._id).select("title");
        return {
          name: product?.title
            ? product.title.substring(0, 15) + "..."
            : "Unknown",
          sales: p.sales,
        };
      }),
    );
    const statusRaw = await OrderModel.aggregate([
      { $unwind: "$items" },
      { $match: { "items.vendor": vendorId } },
      { $group: { _id: "$orderStatus", value: { $sum: 1 } } },
    ]);
    const pieChartData = statusRaw.map((s) => ({
      name: s._id,
      value: s.value,
    }));

    return NextResponse.json(
      {
        summary: {
          totalProducts,
          activeProducts,
          ...stats,
        },
        charts: {
          lineChartData,
          barChartData,
          pieChartData,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Vendor Dashboard Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
