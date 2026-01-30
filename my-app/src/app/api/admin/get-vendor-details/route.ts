import { auth } from "@/auth";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { vendorId } = await req.json();
    if (!vendorId)
      return NextResponse.json(
        { message: "Vendor ID required" },
        { status: 400 },
      );
    const vendor = await UserModel.findById(vendorId).select("-password");
    if (!vendor)
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 },
      );
    const products = await productModel
      .find({ vendor: vendorId })
      .sort({ createdAt: -1 });
    return NextResponse.json({ vendor, products }, { status: 200 });
  } catch (error: any) {
    console.error("Vendor Details Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
