import { Schema, model } from "mongoose";
import { CONSTANT } from "../../../util/constant";

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

const userModel = model(
  CONSTANT.DB_MODEL.USER,
  userSchema,
  CONSTANT.DB_MODEL.USER,
);

export default userModel;
