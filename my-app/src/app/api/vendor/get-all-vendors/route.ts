import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import UserModel from "@/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const vendors = await UserModel.find({ role: "vendor" });
    if (vendors.length == 0) {
      return NextResponse.json(
        { message: "No vendors found" },
        { status: 404 },
      );
    }
    return NextResponse.json(vendors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in Get All Vendors Route ${error}` },
      { status: 500 },
    );
  }
}
