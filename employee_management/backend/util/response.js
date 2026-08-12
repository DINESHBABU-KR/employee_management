import { encryptObject } from "./secure";
import Config from "../config";

export const sendResponse = async (data, statusCode, res) => {
  return res.status(statusCode).json(data);
};
