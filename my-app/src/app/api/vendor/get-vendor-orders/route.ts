import { auth } from "@/auth";
import connectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import productModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (
      !session ||
      !session.user ||
      !session.user.id ||
      session.user.role !== "vendor"
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const currentVendorId = String(session.user.id);
    const allOrders = await OrderModel.find({})
      .populate({
        path: "items.product",
        model: productModel,
        select: "title image1 price category",
      })
      .sort({ createdAt: -1 })
      .lean();
    const vendorOrders = allOrders.filter(
      (order: any) =>
        order.items &&
        order.items.some(
          (item: any) => String(item.vendor) === currentVendorId,
        ),
    );
    return NextResponse.json({ orders: vendorOrders }, { status: 200 });
  } catch (error: any) {
    console.error("Get Vendor Orders Error:", error);
    return NextResponse.json(
      { message: `Error fetching orders: ${error.message || error}` },
      { status: 500 },
    );
  }
}
