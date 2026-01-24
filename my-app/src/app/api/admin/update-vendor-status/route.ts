import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { auth } from "@/auth";

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
    const { vendorId, status, rejectReason } = await req.json();
    if (!vendorId || !status) {
      return NextResponse.json(
        { message: "Invalid vendor id or status" },
        { status: 400 },
      );
    }
    const vendor = await UserModel.findById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 404 },
      );
    }
    if (status === "approved") {
      vendor.isShopApproved = true;
      vendor.shopVerificationStatus = "approved";
      vendor.approvedAt = new Date();
      vendor.rejectReason = "";
    }
    if (status === "rejected") {
      vendor.isShopApproved = false;
      vendor.shopVerificationStatus = "rejected";
      vendor.rejectReason = rejectReason || "Rejected By Admin";
    }
    await vendor.save();
    return NextResponse.json(
      { message: "Vendor status updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error updating vendor status: ${error}` },
      { status: 500 },
    );
  }
}
