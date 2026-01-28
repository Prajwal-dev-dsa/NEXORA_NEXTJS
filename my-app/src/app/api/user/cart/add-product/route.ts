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
    const { productId, quantity = 1 } = await req.json();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (!productId) {
      return NextResponse.json(
        { message: "Missing required fields" },
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
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in cart add-product route ${error}` },
      { status: 500 },
    );
  }
}
