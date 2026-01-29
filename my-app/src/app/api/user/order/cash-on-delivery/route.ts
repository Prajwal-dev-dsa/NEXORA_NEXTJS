import { auth } from "@/auth";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await UserModel.findOne({
      email: session.user.email,
    }).populate("cart.product");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (!user.cart || user.cart.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }
    const { shippingAddress } = await req.json();
    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zipCode
    ) {
      return NextResponse.json(
        { message: "Invalid shipping address" },
        { status: 400 },
      );
    }
    let totalAmount = 0;
    const orderItems = [];
    for (const item of user.cart) {
      const product = item.product as any;
      if (!product || !product.isActive) {
        return NextResponse.json(
          {
            message: `Product "${product?.title || "Unknown"}" is not available`,
          },
          { status: 400 },
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for "${product.title}"` },
          { status: 400 },
        );
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        vendor: product.vendor,
        quantity: item.quantity,
        price: product.price,
      });
    }
    const newOrder = await OrderModel.create({
      user: user._id,
      items: orderItems,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
      shippingAddress,
    });
    await Promise.all(
      user.cart.map((item: any) =>
        productModel.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        }),
      ),
    );
    user.cart = [];
    if (!user.orders) user.orders = [];
    user.orders.push(newOrder._id);
    await user.save();

    return NextResponse.json(
      { message: "Order placed successfully", orderId: newOrder._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create COD Order Error:", error);
    return NextResponse.json(
      { message: `Error creating order: ${error.message || error}` },
      { status: 500 },
    );
  }
}
