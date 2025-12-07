import express from "express";
import { initDB } from "./config/db.config";
import { userRouter } from "./modules/users/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { vehicleRouter } from "./modules/vehicles/vehicle.route";
import { bookingRoute } from "./modules/booking/booking.route";

const app = express();

//? parse json
app.use(express.json());

//? initialize database
initDB();

//? root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Vehicle Rental System API where you can rent your favorite vehicle by Tomjid",
  });
});

//? auth route
app.use("/api/v1/auth", authRouter);

//? user route
app.use("/api/v1", userRouter);

//? vehicles route
app.use("/api/v1/vehicles", vehicleRouter);

//? booking route
app.use("/api/v1/bookings", bookingRoute);

//! 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});


export default app;
