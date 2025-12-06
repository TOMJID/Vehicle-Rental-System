import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth.middleware";

const routes = express.Router();

//? create booking

routes.post("/", auth("admin", "customer"), bookingController.createBooking);

export const bookingRoute = routes;
