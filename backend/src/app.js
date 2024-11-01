import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "22kb" }));
app.use(express.urlencoded({ limit: "22kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import UserRoutes from "../src/routes/User.Route.js"
app.use("/api/v1/user",UserRoutes);

import DoctorRoutes from "../src/routes/Doctor.Route.js"
app.use("/api/v1/doctor",DoctorRoutes);

import SlotRoutes from "../src/routes/Slot.Route.js"
app.use("/api/v1/Slot",SlotRoutes);

export { app };