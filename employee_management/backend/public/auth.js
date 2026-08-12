const token = localStorage.getItem("jwtToken") || sessionStorage.getItem("jwtToken");

if (token) {
  window.location.href = "/dashboard";
}

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formMessage = document.getElementById("formMessage");

const validateLogin = () => {
  const errors = {};
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
  if (!password) errors.password = "Password is required";

  document.getElementById("emailError").textContent = errors.email || "";
  document.getElementById("passwordError").textContent = errors.password || "";
  return Object.keys(errors).length === 0;
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!validateLogin()) return;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });
    const result = await response.json();

    if (!response.ok || !result.status) {
      formMessage.textContent = result.message || "Login failed";
      return;
    }

    localStorage.setItem("jwtToken", result.data.token);
    localStorage.setItem("authUser", JSON.stringify(result.data.userData));
    window.location.href = "/dashboard";
  } catch (error) {
    formMessage.textContent = "Unable to login. Please try again.";
  }
});
