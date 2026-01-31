import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { shopId } = await req.json();
    const shop = await UserModel.findById(shopId).select(
      "-password -orders -cart",
    );
    if (!shop)
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    const products = await productModel.find({
      vendor: shopId,
      isActive: true,
      productVerificationStatus: "approved",
    });
    return NextResponse.json({ shop, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
