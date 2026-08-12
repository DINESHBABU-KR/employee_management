import { Schema, model } from "mongoose";
import { CONSTANT } from "../../../util/constant";

const employeeSchema = new Schema(
  {
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    joiningDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

employeeSchema.index({ employeeName: "text", email: "text" });

export default model(
  CONSTANT.DB_MODEL.EMPLOYEE,
  employeeSchema,
  CONSTANT.DB_MODEL.EMPLOYEE,
);
