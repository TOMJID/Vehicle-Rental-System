import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth.middleware";

const routes = express.Router();

//? create booking
routes.post("/", auth("admin", "customer"), bookingController.createBooking);

//? get booking for admin all & for customer to access there booking
routes.get("/", auth("admin", "customer"), bookingController.getBooking);
export const bookingRoute = routes;
