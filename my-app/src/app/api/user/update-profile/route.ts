import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as File | null;
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 },
      );
    }
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await uploadOnCloudinary(image);
    }
    const user = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      {
        name,
        phone,
        image: imageUrl,
      },
      {
        new: true,
      },
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error in update-profile ${error}` },
      { status: 500 },
    );
  }
}
