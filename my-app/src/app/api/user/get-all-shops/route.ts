import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const shops = await UserModel.find({
      role: "vendor",
      shopVerificationStatus: "approved",
      isShopApproved: true,
    }).select("name shopName shopAddress image email phone");
    return NextResponse.json({ shops }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
