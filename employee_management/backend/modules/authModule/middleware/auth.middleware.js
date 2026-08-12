import { verifyToken } from "../../../util/jwtUtil";
import { findUserById } from "../service/auth.service";

export const protect = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in. Please log in to access this resource.",
    });
  }

  try {
    const decoded = await verifyToken(token);

    const currentUser = await findUserById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    if (!currentUser.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const adminOnly = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      data: null,
      error: null,
      message: "Only admin users can perform this action.",
      status: false,
    });
  }

  next();
};
