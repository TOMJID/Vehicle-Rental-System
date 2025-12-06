import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    // The payload comes from req.body
    const result = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Create Booking Error:", error.message);

    // Determine status code based on error type
    let statusCode = 500;
    if (
      error.message === "Vehicle not found" ||
      error.message === "Vehicle is currently not available" ||
      error.message === "End date cannot be before start date"
    ) {
      statusCode = 400; // Bad Request
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const bookingController = {
  createBooking,
};
