const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

if (!token) {
  window.location.href = "/";
}

const rows = document.getElementById("employeeRows");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const statusFilter = document.getElementById("statusFilter");
const dialog = document.getElementById("employeeDialog");
const form = document.getElementById("employeeForm");
let employees = [];

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const result = await response.json();

  if (response.status === 401) {
    logout();
    return null;
  }

  if (!response.ok || !result.status) {
    throw new Error(result.message || result.error || "Request failed");
  }

  return result.data;
};

const logout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("authUser");
  sessionStorage.removeItem("jwtToken");
  window.location.href = "/";
};

const formatDate = (value) => new Date(value).toLocaleDateString();

const updateDepartmentFilter = () => {
  const selected = departmentFilter.value;
  const departments = [...new Set(employees.map((employee) => employee.department))].sort();
  departmentFilter.innerHTML = '<option value="">All departments</option>';
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    departmentFilter.appendChild(option);
  });
  departmentFilter.value = selected;
};

const renderEmployees = () => {
  rows.innerHTML = "";
  emptyState.hidden = employees.length > 0;

  employees.forEach((employee) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${employee.employeeName}</td>
      <td>${employee.email}</td>
      <td>${employee.department}</td>
      <td>${employee.designation}</td>
      <td><span class="status ${employee.status.toLowerCase()}">${employee.status}</span></td>
      <td>${formatDate(employee.joiningDate)}</td>
      <td class="actions">
        <button class="secondary" data-action="edit" data-id="${employee._id}">Edit</button>
        <button class="danger" data-action="delete" data-id="${employee._id}">Delete</button>
      </td>
    `;
    rows.appendChild(row);
  });
};

const loadEmployees = async () => {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (departmentFilter.value) params.set("department", departmentFilter.value);
  if (statusFilter.value) params.set("status", statusFilter.value);

  employees = await request(`/api/employees?${params.toString()}`);
  updateDepartmentFilter();
  renderEmployees();
};

const openForm = (employee = null) => {
  document.getElementById("dialogTitle").textContent = employee ? "Edit Employee" : "Add Employee";
  document.getElementById("employeeId").value = employee?._id || "";
  document.getElementById("employeeName").value = employee?.employeeName || "";
  document.getElementById("employeeEmail").value = employee?.email || "";
  document.getElementById("employeeDepartment").value = employee?.department || "";
  document.getElementById("employeeDesignation").value = employee?.designation || "";
  document.getElementById("employeeStatus").value = employee?.status || "Active";
  document.getElementById("joiningDate").value = employee?.joiningDate?.slice(0, 10) || "";
  document.getElementById("employeeMessage").textContent = "";
  dialog.showModal();
};

const getFormData = () => ({
  employeeName: document.getElementById("employeeName").value.trim(),
  email: document.getElementById("employeeEmail").value.trim(),
  department: document.getElementById("employeeDepartment").value.trim(),
  designation: document.getElementById("employeeDesignation").value.trim(),
  status: document.getElementById("employeeStatus").value,
  joiningDate: document.getElementById("joiningDate").value,
});

const validateEmployee = (employee) => {
  if (Object.values(employee).some((value) => !value)) return "All employee fields are required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) return "Enter a valid employee email.";
  return "";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const employee = getFormData();
  const message = validateEmployee(employee);
  const employeeId = document.getElementById("employeeId").value;
  const employeeMessage = document.getElementById("employeeMessage");

  if (message) {
    employeeMessage.textContent = message;
    return;
  }

  try {
    await request(employeeId ? `/api/employees/${employeeId}` : "/api/employees", {
      method: employeeId ? "PUT" : "POST",
      body: JSON.stringify(employee),
    });
    dialog.close();
    await loadEmployees();
  } catch (error) {
    employeeMessage.textContent = error.message;
  }
});

rows.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const employee = employees.find((item) => item._id === button.dataset.id);
  if (button.dataset.action === "edit") {
    openForm(employee);
  }

  if (button.dataset.action === "delete" && confirm("Delete this employee?")) {
    await request(`/api/employees/${button.dataset.id}`, { method: "DELETE" });
    await loadEmployees();
  }
});

document.getElementById("addEmployeeBtn").addEventListener("click", () => openForm());
document.getElementById("cancelDialogBtn").addEventListener("click", () => dialog.close());
document.getElementById("logoutBtn").addEventListener("click", logout);
searchInput.addEventListener("input", loadEmployees);
departmentFilter.addEventListener("change", loadEmployees);
statusFilter.addEventListener("change", loadEmployees);

loadEmployees();
