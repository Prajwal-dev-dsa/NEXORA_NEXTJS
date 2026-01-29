import { auth } from "@/auth";
import connectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { orderId } = await req.json();
    if (!orderId)
      return NextResponse.json(
        { message: "Order ID required" },
        { status: 400 },
      );
    const order = await OrderModel.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
      return NextResponse.json(
        { message: `Cannot cancel order in '${order.orderStatus}' state.` },
        { status: 400 },
      );
    }
    order.orderStatus = "Cancelled";
    await order.save();
    return NextResponse.json(
      { message: "Order cancelled successfully", order },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Error cancelling order" },
      { status: 500 },
    );
  }
}
