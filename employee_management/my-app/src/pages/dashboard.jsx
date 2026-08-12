import { useEffect, useMemo, useState } from "react";
import config from "../config";

const emptyEmployee = {
  employeeName: "",
  email: "",
  department: "",
  designation: "",
  status: "Active",
  joiningDate: "",
};

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function getStoredUser() {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
  });
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const token = useMemo(() => getStoredToken(), []);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    setUser(getStoredUser());
    loadEmployees();
    loadDepartments();
  }, [token]);

  const request = async (url, options = {}) => {
    const response = await fetch(`${config.API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const result = await response.json();

    if (response.status === 401) {
      handleLogout();
      return null;
    }

    if (!response.ok || !result.status) {
      throw new Error(result.message || result.error || "Request failed");
    }

    return result.data;
  };

  const loadEmployees = async (nextFilters = filters) => {
    try {
      setIsLoading(true);
      setMessage("");

      const params = new URLSearchParams();
      if (nextFilters.search.trim()) params.set("search", nextFilters.search.trim());
      if (nextFilters.department) params.set("department", nextFilters.department);
      if (nextFilters.status) params.set("status", nextFilters.status);

      const data = await request(`/api/employees?${params.toString()}`);
      setEmployees(data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await request("/api/employees");
      const nextDepartments = [
        ...new Set((data || []).map((employee) => employee.department).filter(Boolean)),
      ].sort();
      setDepartments(nextDepartments);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const nextFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(nextFilters);
    loadEmployees(nextFilters);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const validateEmployee = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.employeeName.trim()) nextErrors.employeeName = "Employee name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!emailPattern.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.department.trim()) nextErrors.department = "Department is required";
    if (!form.designation.trim()) nextErrors.designation = "Designation is required";
    if (!form.status) nextErrors.status = "Status is required";
    if (!form.joiningDate) nextErrors.joiningDate = "Joining date is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setForm(emptyEmployee);
    setEditingId("");
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!isAdmin) {
      setMessage("Only admin users can add or edit employees.");
      return;
    }

    if (!validateEmployee()) return;

    try {
      setIsSaving(true);

      await request(editingId ? `/api/employees/${editingId}` : "/api/employees", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({
          employeeName: form.employeeName.trim(),
          email: form.email.trim(),
          department: form.department.trim(),
          designation: form.designation.trim(),
          status: form.status,
          joiningDate: form.joiningDate,
        }),
      });

      setMessage(editingId ? "Employee updated successfully" : "Employee created successfully");
      resetForm();
      await loadEmployees();
      await loadDepartments();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (employee) => {
    if (!isAdmin) {
      setMessage("Only admin users can edit employees.");
      return;
    }

    setEditingId(employee._id);
    setForm({
      employeeName: employee.employeeName || "",
      email: employee.email || "",
      department: employee.department || "",
      designation: employee.designation || "",
      status: employee.status || "Active",
      joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : "",
    });
    setErrors({});
    setMessage("");
  };

  const handleDelete = async (employee) => {
    if (!isAdmin) {
      setMessage("Only admin users can delete employees.");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${employee.employeeName}?`,
    );

    if (!isConfirmed) return;

    try {
      await request(`/api/employees/${employee._id}`, {
        method: "DELETE",
      });
      setMessage("Employee deleted successfully");
      await loadEmployees();
      await loadDepartments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <main>
      <header>
        <h1>Employee Management Dashboard</h1>
        <p>
          {user?.name ? `Logged in as ${user.name}` : "Logged in"}
          {user?.role ? ` (${user.role})` : ""}
        </p>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {isAdmin && (
        <section>
          <h2>{editingId ? "Edit Employee" : "Create Employee"}</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="employeeName">Employee Name</label>
              <input
                id="employeeName"
                name="employeeName"
                value={form.employeeName}
                onChange={handleFormChange}
              />
              {errors.employeeName && <p>{errors.employeeName}</p>}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
              />
              {errors.email && <p>{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={handleFormChange}
              />
              {errors.department && <p>{errors.department}</p>}
            </div>

            <div>
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                name="designation"
                value={form.designation}
                onChange={handleFormChange}
              />
              {errors.designation && <p>{errors.designation}</p>}
            </div>

            <div>
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleFormChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && <p>{errors.status}</p>}
            </div>

            <div>
              <label htmlFor="joiningDate">Joining Date</label>
              <input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={form.joiningDate}
                onChange={handleFormChange}
              />
              {errors.joiningDate && <p>{errors.joiningDate}</p>}
            </div>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update Employee" : "Add Employee"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </form>
        </section>
      )}

      <section>
        <h2>Employee Listing</h2>

        <div>
          <label htmlFor="search">Search by employee name/email</label>
          <input
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search name or email"
          />
        </div>

        <div>
          <label htmlFor="departmentFilter">Filter by department</label>
          <select
            id="departmentFilter"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="statusFilter">Filter by status</label>
          <select
            id="statusFilter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {message && <p>{message}</p>}
        {isLoading && <p>Loading employees...</p>}

        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Joining Date</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeName}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>{employee.status}</td>
                <td>
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString()
                    : ""}
                </td>
                {isAdmin && (
                  <td>
                    <button type="button" onClick={() => handleEdit(employee)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(employee)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {!isLoading && employees.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 7 : 6}>No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Dashboard;
