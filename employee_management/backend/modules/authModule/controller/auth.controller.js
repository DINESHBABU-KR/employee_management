import { generateToken } from "../../../util/jwtUtil";
import { sendResponse } from "../../../util/response";
import { bcryptPassword, comparePassword } from "../../../util/secure";
import { getOneUser, saveUser } from "../service/auth.service";

export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, name, role } = req.body;
    let userExist = await getOneUser({ email });
    if (userExist) {
      return sendResponse(
        {
          data: null,
          error: null,
          message: "User Already Register.please Login",
          status: false,
        },
        200,
        res,
      );
    }
    if (password.trim() != confirmPassword.trim()) {
      return sendResponse(
        {
          data: null,
          error: null,
          message: "Confirm Password Mismatced",
          status: false,
        },
        200,
        res,
      );
    }
    let savedUser = await saveUser({
      email,
      password: await bcryptPassword(password),
      name,
      role,
    });

    return sendResponse(
      {
        data: null,
        error: null,
        message: "Registered Successfully",
        status: true,
      },
      200,
      res,
    );
  } catch (err) {
    console.log("🚀 ~ register ~ err:", err);
    return sendResponse(
      {
        data: null,
        error: err.toString(),
        message: "",
        status: false,
      },
      200,
      res,
    );
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let existUser = await getOneUser({ email });
    if (!existUser) {
      return sendResponse(
        {
          data: null,
          error: null,
          message: "User Not found. please Register first",
          status: false,
        },
        200,
        res,
      );
    }
    let isCorrectPassword = await comparePassword(password, existUser.password);
    if (!isCorrectPassword) {
      return sendResponse(
        {
          data: null,
          error: null,
          message: "Password Mismatch",
          status: false,
        },
        200,
        res,
      );
    }
    let jwtToken = await generateToken(existUser);
    return sendResponse(
      {
        data: {
          userData: {
            id: existUser._id,
            name: existUser.name,
            email: existUser.email,
            role: existUser.role,
          },
          token: jwtToken,
        },
        error: null,
        message: "Logged in Successfully",
        status: true,
      },
      200,
      res,
    );
  } catch (err) {
    console.log("🚀 ~ login ~ err:", err);
    return sendResponse(
      {
        data: null,
        error: err.toString(),
        message: "",
        status: false,
      },
      200,
      res,
    );
  }
};
