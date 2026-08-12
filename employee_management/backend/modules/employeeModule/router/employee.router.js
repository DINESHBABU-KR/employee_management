const app = require("express");
const {
  addEmployee,
  editEmployee,
  listEmployees,
  removeEmployee,
} = require("../controller/employee.controller");
const { adminOnly, protect } = require("../../authModule/middleware/auth.middleware");

const router = app.Router();

router.route("/").get(protect, listEmployees).post(protect, adminOnly, addEmployee);
router
  .route("/:id")
  .put(protect, adminOnly, editEmployee)
  .delete(protect, adminOnly, removeEmployee);

module.exports = router;
