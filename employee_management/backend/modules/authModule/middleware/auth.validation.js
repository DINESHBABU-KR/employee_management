import { sendResponse } from "../../../util/response";

let emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

const isEmpty = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

export const registerValidation = async (req, res, next) => {
  try {
    let errors = {},
      { email, password, confirmPassword, name, role } = req.body;

    if (isEmpty(email)) {
      errors.email = "Email field is required";
    } else if (isEmpty(email?.match(emailRegex))) {
      errors.email = "Enter Valid Address";
    }

    if (isEmpty(password)) {
      errors.password = "Password field is required";
    }

    if (isEmpty(confirmPassword)) {
      errors.confirmPassword = "confirmPassword field is required";
    }

    if (isEmpty(name)) {
      errors.name = "name field is required";
    }

    if (isEmpty(role)) {
      errors.role = "role field is required";
    }

    if (!isEmpty(errors)) {
      return sendResponse({ status: false, errors: errors }, 400, res);
    }
    next();
  } catch (err) {
    console.log("🚀 ~ registerValidation ~ err:", err);
    return sendResponse(
      { data: null, error: err.toString(), message: "Validation failed", status: false },
      500,
      res,
    );
  }
};

export const loginValidation = async (req, res, next) => {
  try {
    let errors = {},
      { email, password } = req.body;

    if (isEmpty(email)) {
      errors.email = "Email field is required";
    } else if (isEmpty(email?.match(emailRegex))) {
      errors.email = "Enter Valid Address";
    }

    if (isEmpty(password)) {
      errors.password = "Password field is required";
    }

    if (!isEmpty(errors)) {
      return sendResponse({ status: false, errors: errors }, 400, res);
    }

    next();
  } catch (err) {
    console.log("🚀 ~ registerValidation ~ err:", err);
    return sendResponse(
      { data: null, error: err.toString(), message: "Validation failed", status: false },
      500,
      res,
    );
  }
};
