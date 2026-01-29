import mongoose from "mongoose";

export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: string;
  items: {
    product: mongoose.Types.ObjectId;
    vendor: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus:
    | "Processing"
    | "Confirmed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        vendor: {
          type: String,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true },
);

const OrderModel =
  mongoose.models?.Order || mongoose.model<IOrder>("Order", orderSchema);

export default OrderModel;
