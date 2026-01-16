import { auth } from "@/auth";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { role, phone } = await req.json();
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await UserModel.findOneAndUpdate(
      { email: session?.user?.email },
      { role, phone },
      { new: true }
    );
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in Edit role phone route: ${error}` },
      { status: 500 }
    );
  }
}
