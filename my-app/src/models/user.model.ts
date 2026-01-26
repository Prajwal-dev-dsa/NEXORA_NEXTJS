import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  image?: string;
  role: "user" | "admin" | "vendor" | "deliveryGuy";
  socketId?: string | null;

  // delivery guy location
  location: {
    type: {
      type: string;
      enum: string[];
      default: string;
    };
    coordinates: {
      type: number[];
      default: number[];
    };
  };

  // vendor details
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  isShopApproved?: boolean;
  shopVerificationStatus?: "pending" | "approved" | "rejected";
  requestedAt?: Date;
  approvedAt?: Date;
  rejectReason?: string;
  vendorProducts?: mongoose.Types.ObjectId[];
  orders?: mongoose.Types.ObjectId[];
  cart?: {
    product: mongoose.Types.ObjectId[];
    quantity: number;
  }[];

  // timestamps
  createdAt?: string;
  updatedAt?: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "vendor", "deliveryGuy"],
      default: "user",
    },
    socketId: {
      type: String,
      default: null,
    },

    // delivery guy location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // vendor details
    shopName: {
      type: String,
      unique: true,
      sparse: true,
    },
    shopAddress: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    isShopApproved: {
      type: Boolean,
      default: false,
    },
    shopVerificationStatus: {
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
    vendorProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.index({ location: "2dsphere" });

const UserModel =
  mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
