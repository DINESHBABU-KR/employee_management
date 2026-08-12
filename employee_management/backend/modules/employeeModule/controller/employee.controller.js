import { sendResponse } from "../../../util/response";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "../service/employee.service";

const requiredFields = [
  "employeeName",
  "email",
  "department",
  "designation",
  "status",
  "joiningDate",
];

const validateEmployee = (body) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!body[field] || String(body[field]).trim() === "") {
      errors[field] = `${field} is required`;
    }
  });

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.email = "Enter valid email";
  }

  if (body.status && !["Active", "Inactive"].includes(body.status)) {
    errors.status = "Status must be Active or Inactive";
  }

  return errors;
};

export const listEmployees = async (req, res) => {
  try {
    const employees = await getEmployees(req.query);
    return sendResponse(
      { data: employees, error: null, message: "Employees fetched", status: true },
      200,
      res,
    );
  } catch (err) {
    return sendResponse(
      { data: null, error: err.toString(), message: "", status: false },
      500,
      res,
    );
  }
};

export const addEmployee = async (req, res) => {
  try {
    const errors = validateEmployee(req.body);
    if (Object.keys(errors).length) {
      return sendResponse({ data: null, errors, message: "Validation failed", status: false }, 400, res);
    }

    const employee = await createEmployee(req.body);
    return sendResponse(
      { data: employee, error: null, message: "Employee created", status: true },
      201,
      res,
    );
  } catch (err) {
    return sendResponse(
      { data: null, error: err.toString(), message: "Employee not created", status: false },
      500,
      res,
    );
  }
};

export const editEmployee = async (req, res) => {
  try {
    const errors = validateEmployee(req.body);
    if (Object.keys(errors).length) {
      return sendResponse({ data: null, errors, message: "Validation failed", status: false }, 400, res);
    }

    const employee = await updateEmployee(req.params.id, req.body);
    if (!employee) {
      return sendResponse({ data: null, error: null, message: "Employee not found", status: false }, 404, res);
    }

    return sendResponse(
      { data: employee, error: null, message: "Employee updated", status: true },
      200,
      res,
    );
  } catch (err) {
    return sendResponse(
      { data: null, error: err.toString(), message: "Employee not updated", status: false },
      500,
      res,
    );
  }
};

export const removeEmployee = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return sendResponse({ data: null, error: null, message: "Employee not found", status: false }, 404, res);
    }

    await deleteEmployee(req.params.id);
    return sendResponse(
      { data: null, error: null, message: "Employee deleted", status: true },
      200,
      res,
    );
  } catch (err) {
    return sendResponse(
      { data: null, error: err.toString(), message: "Employee not deleted", status: false },
      500,
      res,
    );
  }
};
