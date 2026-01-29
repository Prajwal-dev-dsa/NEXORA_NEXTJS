import { auth } from "@/auth";
import connectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized: No session found" },
        { status: 401 },
      );
    }
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        {
          message: `Access Denied: You are a '${session.user.role}', but this action requires 'vendor'.`,
        },
        { status: 403 },
      );
    }
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 },
      );
    }
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const currentVendorId = String(session.user.id);
    const isOrderForThisVendor =
      order.items &&
      order.items.some((item: any) => {
        const itemVendorId = item.vendor ? String(item.vendor) : null;
        return itemVendorId === currentVendorId;
      });

    if (!isOrderForThisVendor) {
      return NextResponse.json(
        {
          message: "Unauthorized: You do not own the products in this order.",
          debug: `Your ID: ${currentVendorId}`,
        },
        { status: 403 },
      );
    }
    if (order.orderStatus === "Processing") {
      order.orderStatus = "Confirmed";
      await order.save();

      return NextResponse.json(
        {
          message: "Order Confirmed successfully",
          orderStatus: order.orderStatus,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          message: `Cannot confirm. Current status is already '${order.orderStatus}'`,
        },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Confirm Order Error:", error);
    return NextResponse.json(
      { message: `Error confirming order: ${error.message || error}` },
      { status: 500 },
    );
  }
}
