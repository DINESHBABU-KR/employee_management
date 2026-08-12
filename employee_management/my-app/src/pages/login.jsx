import { useEffect, useState } from "react";
import config from "../config";

function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        setMessage(result.message || "Login failed");
        return;
      }

      const storage = form.rememberMe ? localStorage : sessionStorage;
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      storage.setItem("token", result.data.token);
      storage.setItem("user", JSON.stringify(result.data.userData));

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="rememberMe">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            Keep me logged in
          </label>
        </div>

        {message && <p>{message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        New user? <a href="/register">Create an account</a>
      </p>
    </main>
  );
}

export default Login;
