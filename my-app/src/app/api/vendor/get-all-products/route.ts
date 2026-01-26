import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import productModel from "@/models/product.model";

export async function GET() {
  try {
    await connectDB();
    const products = await productModel
      .find()
      .populate("vendor")
      .sort({ createdAt: -1 });
    if (products.length == 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 },
      );
    }
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in Get All Products Route ${error}` },
      { status: 500 },
    );
  }
}
