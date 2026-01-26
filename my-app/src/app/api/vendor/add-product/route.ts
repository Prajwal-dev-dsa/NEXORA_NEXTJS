import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "vendor") {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isProductWearable = formData.get("isProductWearable") === "true";
    const sizes = formData.getAll("sizes");
    const freeDelivery = formData.get("freeDelivery") === "true";
    const warranty = formData.get("warranty");
    const replacementDays = Number(formData.get("replacementDays"));
    const cashOnDelivery = formData.get("cashOnDelivery") === "true";
    const detailPoints = formData.getAll("detailPoints");
    const image1 = formData.get("image1") as Blob;
    const image2 = formData.get("image2") as Blob;
    const image3 = formData.get("image3") as Blob;
    const image4 = formData.get("image4") as Blob;

    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !image1 ||
      !image2 ||
      !image3 ||
      !image4
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    if (isProductWearable && sizes.length === 0) {
      return NextResponse.json(
        { message: "Sizes are required" },
        { status: 400 },
      );
    }
    const img1 = await uploadOnCloudinary(image1);
    const img2 = await uploadOnCloudinary(image2);
    const img3 = await uploadOnCloudinary(image3);
    const img4 = await uploadOnCloudinary(image4);

    const product = await productModel.create({
      title,
      description,
      price,
      stock,
      isStockAvailable: stock > 0,
      image1: img1,
      image2: img2,
      image3: img3,
      image4: img4,
      category,
      vendor: session.user.id,
      isProductWearable,
      sizes: isProductWearable ? sizes : [],
      replacementDays,
      warranty,
      cashOnDelivery,
      detailPoints,
      freeDelivery,
      productVerificationStatus: "pending",
      isActive: false,
      requestedAt: new Date(),
    });
    await UserModel.findByIdAndUpdate(
      session.user.id,
      {
        $push: {
          vendorProducts: product._id,
        },
      },
      {
        new: true,
      },
    );
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error in add-product ${error}` },
      { status: 500 },
    );
  }
}
