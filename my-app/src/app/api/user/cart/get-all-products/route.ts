import { auth } from "@/auth";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await UserModel.findOne({
      email: session.user.email,
    }).populate("cart.product");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ cart: user.cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in cart get-all-products route ${error}` },
      { status: 500 },
    );
  }
}
