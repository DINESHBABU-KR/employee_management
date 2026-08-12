import Employee from "../Model/Employee";

export const createEmployee = async (data) => {
  return await Employee.create(data);
};

export const getEmployees = async ({ search, department, status }) => {
  const query = {};

  if (search) {
    query.$or = [
      { employeeName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (department) {
    query.department = department;
  }

  if (status) {
    query.status = status;
  }

  return await Employee.find(query).sort({ createdAt: -1 }).lean();
};

export const getEmployeeById = async (id) => {
  return await Employee.findById(id).lean();
};

export const updateEmployee = async (id, data) => {
  return await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteEmployee = async (id) => {
  return await Employee.findByIdAndDelete(id).lean();
};
