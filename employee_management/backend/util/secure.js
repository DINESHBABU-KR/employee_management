import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import Config from "../config";

export const encryptObject = (encryptValue) => {
  try {
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(encryptValue),
      Config.API_ENCRYPT_KEY,
    ).toString();

    return ciphertext;
  } catch (err) {
    console.log(err, "EncryptObject_error");

    return "";
  }
};

export const decryptObject = async (data) => {
  try {
    const decData = CryptoJS.enc.Base64.parse(data)?.toString(
      CryptoJS.enc.Utf8,
    );
    const bytes = CryptoJS.AES.decrypt(
      decData,
      Config.API_ENCRYPT_KEY,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(bytes);
  } catch (error) {
    console.log("Customdecryptdata_error", error);
  }
};

export const bcryptPassword = async (password) => {
  try {
    let salt = await bcrypt.genSalt(10);
    let encPassword = await bcrypt.hash(password, salt);
    return encPassword;
  } catch (err) {
    return null;
  }
};

export const comparePassword = async (rawPassword, encPassword) => {
  return await bcrypt.compare(rawPassword, encPassword);
};
