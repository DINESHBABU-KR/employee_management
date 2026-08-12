import cors from "cors";
import express from "express";
import path from "path";
import connectDatabase from "./config/database";
import Config from "./config";
import authRouter from "./modules/authModule/router/auth.router";
import employeeRouter from "./modules/employeeModule/router/employee.router";

const app = express();

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.listen(Config.PORT || 5000, () => {
  console.log(`Server running on port ${Config.PORT || 5000}`);
});
