import { auth } from "@/auth";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { productId } = await req.json();
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    user.cart = user.cart.filter(
      (item: any) => item.product.toString() !== productId.toString(),
    );
    await user.save();
    return NextResponse.json({ cart: user.cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in cart remove-product route ${error}` },
      { status: 500 },
    );
  }
}
