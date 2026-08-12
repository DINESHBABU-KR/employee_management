const dotenv = require("dotenv");

dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  API_ENCRYPT_KEY: process.env.API_ENCRYPT_KEY,
};
export default config;
