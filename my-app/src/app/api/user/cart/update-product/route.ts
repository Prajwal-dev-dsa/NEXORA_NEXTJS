import { auth } from "@/auth";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { productId, quantity } = await req.json();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (!productId || !quantity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    if (quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be greater than 0" },
        { status: 400 },
      );
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    const existingProduct = user.cart.find(
      (item: any) => item.product.toString() === productId.toString(),
    );
    existingProduct.quantity = quantity;
    await user.save();
    return NextResponse.json({ cart: user.cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in cart update-product route ${error}` },
      { status: 500 },
    );
  }
}
