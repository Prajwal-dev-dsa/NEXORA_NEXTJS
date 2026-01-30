import { auth } from "@/auth";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const vendors = await UserModel.find({
      role: "vendor",
      shopVerificationStatus: "approved",
    }).sort({ createdAt: -1 });
    return NextResponse.json({ vendors }, { status: 200 });
  } catch (error: any) {
    console.error("Get Approved Vendors Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
