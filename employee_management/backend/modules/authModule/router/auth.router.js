const app = require("express");
const { register, login } = require("../controller/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/auth.validation");

const router = app.Router();

router.route("/register").post(registerValidation, register);
router.route("/login").post(loginValidation, login);

module.exports = router;
