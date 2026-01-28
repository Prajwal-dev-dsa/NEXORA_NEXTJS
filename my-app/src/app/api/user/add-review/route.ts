import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const productId = formData.get("productId") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;
    const image = formData.get("image") as File | null;

    if (!productId || !rating) {
      return NextResponse.json(
        { message: "Missing required fields" },
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

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await uploadOnCloudinary(image);
    }

    product.reviews.push({
      userName: user.name,
      userImage: user.image,
      rating,
      comment,
      image: imageUrl,
    });

    await product.save();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in add-reviews-of-the-product route ${error}` },
      { status: 500 },
    );
  }
}
