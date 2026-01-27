import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { auth } from "@/auth";
import productModel from "@/models/product.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = session?.user?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { productId, status, rejectReason } = await req.json();
    if (!productId || !status) {
      return NextResponse.json(
        { message: "Invalid product id or status" },
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
    if (status === "approved") {
      product.productVerificationStatus = "approved";
      product.approvedAt = new Date();
      product.rejectReason = "";
    }
    if (status === "rejected") {
      product.productVerificationStatus = "rejected";
      product.rejectReason = rejectReason || "Rejected By Admin";
    }
    await product.save();
    return NextResponse.json(
      { message: "Product status updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error updating product status: ${error}` },
      { status: 500 },
    );
  }
}
