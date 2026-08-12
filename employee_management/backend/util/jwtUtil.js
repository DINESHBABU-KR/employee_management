import jwt from "jsonwebtoken";
import Config from "../config";

export const generateToken = async (data) => {
  return jwt.sign({ id: data._id || data.id }, Config.JWT_SECRET.trim(), {
    expiresIn: Config.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = async (token) => {
  return jwt.verify(token, Config.JWT_SECRET.trim());
};
