import { auth } from "@/auth";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "vendor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { productId, isActive } = await req.json();
    if (!productId || isActive === undefined) {
      return NextResponse.json(
        { message: "Product ID and isActive are required" },
        { status: 400 },
      );
    }
    const product = await productModel.findByIdAndUpdate(
      productId,
      { isActive },
      { new: true },
    );
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error in update-product-status: ${error.message || error}` },
      { status: 500 },
    );
  }
}
