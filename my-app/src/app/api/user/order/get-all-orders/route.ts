import { auth } from "@/auth";
import connectDB from "@/lib/db";
import OrderModel from "@/models/order.model";
import productModel from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const orders = await OrderModel.find({})
      .populate({
        path: "items.product",
        model: productModel,
        select: "title image1 price category",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Get All Orders Error:", error);
    return NextResponse.json(
      { message: `Error fetching orders: ${error.message || error}` },
      { status: 500 },
    );
  }
}
