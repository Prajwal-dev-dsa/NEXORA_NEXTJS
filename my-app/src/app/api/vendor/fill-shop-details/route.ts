import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { NextRequest } from "next/server";
import UserModel from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { shopName, shopAddress, gstNumber } = await req.json();
    if (!shopName || !shopAddress || !gstNumber) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "vendor") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }
    const vendor = await UserModel.findByIdAndUpdate(
      session?.user?.id,
      {
        shopName,
        shopAddress,
        gstNumber,
        requestedAt: new Date(),
        shopVerificationStatus: "pending",
      },
      { new: true },
    );
    if (!vendor) {
      return Response.json({ message: "Vendor not found" }, { status: 404 });
    }
    return Response.json(vendor, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `Error in vendor's fill all details route ${error}` },
      { status: 500 },
    );
  }
}
