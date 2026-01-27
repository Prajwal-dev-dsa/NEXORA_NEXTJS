import { auth } from "@/auth";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import productModel from "@/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "vendor") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const formData = await req.formData();
    const productId = formData.get("productId") as string;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }
    const existingProduct = await productModel.findById(productId);

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    if (existingProduct.vendor.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to edit this product" },
        { status: 403 },
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const category = formData.get("category") as string;
    const isProductWearable = formData.get("isProductWearable") === "true";
    const sizes = formData.getAll("sizes");
    const detailPoints = formData.getAll("detailPoints");
    const freeDelivery = formData.get("freeDelivery") === "true";
    const warranty = formData.get("warranty") as string;
    const replacementDays = Number(formData.get("replacementDays"));
    const cashOnDelivery = formData.get("cashOnDelivery") === "true";

    // Smart Image Handling
    // We check if the incoming data is a File (new upload) or null/string (keep existing)
    const processImage = async (formField: string, existingUrl: string) => {
      const file = formData.get(formField);
      if (file && file instanceof File && file.size > 0) {
        // It's a new file, upload it
        const uploaded = await uploadOnCloudinary(file);
        return uploaded || existingUrl; // Fallback to existing if upload fails
      }
      return existingUrl; // No new file, keep old URL
    };

    const image1 = await processImage("image1", existingProduct.image1);
    const image2 = await processImage("image2", existingProduct.image2);
    const image3 = await processImage("image3", existingProduct.image3);
    const image4 = await processImage("image4", existingProduct.image4);
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        stock,
        isStockAvailable: stock > 0,
        image1,
        image2,
        image3,
        image4,
        category,
        isProductWearable,
        sizes: isProductWearable ? sizes : [],
        replacementDays,
        warranty,
        cashOnDelivery,
        detailPoints,
        freeDelivery,
        productVerificationStatus: "pending",
        isActive: false,
        rejectReason: "",
      },
      { new: true },
    );

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return NextResponse.json(
      { message: `Error in update-product: ${error.message || error}` },
      { status: 500 },
    );
  }
}
