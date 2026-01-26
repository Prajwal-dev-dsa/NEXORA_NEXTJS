import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  stock: number;
  isStockAvailable: boolean;
  vendor: IUser;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  category: string;
  isProductWearable: boolean;
  sizes?: string[];
  productVerificationStatus?: "pending" | "approved" | "rejected";
  requestedAt?: Date;
  approvedAt?: Date;
  rejectReason?: string;
  isActive: boolean;
  replacementDays: number;
  freeDelivery: boolean;
  warranty: string;
  cashOnDelivery: boolean;
  detailPoints: string[];
  reviews: [
    {
      user: IUser;
      rating: number;
      comment?: string;
      image?: string;
      createdAt?: Date;
    },
  ];
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    isStockAvailable: {
      type: Boolean,
      default: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    image4: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isProductWearable: {
      type: Boolean,
      required: false,
    },
    sizes: {
      type: [String],
      default: [],
    },
    productVerificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
    },
    approvedAt: {
      type: Date,
    },
    rejectReason: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    replacementDays: {
      type: Number,
      default: 0,
    },
    freeDelivery: {
      type: Boolean,
      default: false,
    },
    warranty: {
      type: String,
      default: "No Warranty",
    },
    cashOnDelivery: {
      type: Boolean,
      default: false,
    },
    detailPoints: {
      type: [String],
      default: [],
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
        },
        image: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const productModel =
  mongoose.models?.Product ||
  mongoose.model<IProduct>("Product", productSchema);
export default productModel;
