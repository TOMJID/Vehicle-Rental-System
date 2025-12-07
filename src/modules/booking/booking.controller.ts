import { Request, Response } from "express";
import { bookingService } from "./booking.service";

//? create booking controller
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

//? get booking Role-based
const getBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    console.log(req.user);
    const result = await bookingService.getBooking(user.id, user.role);
    const message =
      user.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//? update booking controller
const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await bookingService.updateBooking(
      Number(bookingId),
      user.id,
      user.role,
      status
    );

    let message = "Booking updated successfully";
    if (status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
    }

    res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    console.error("Update Booking Error:", error.message);
    
    let statusCode = 500;
    if (
        error.message === "Booking not found" ||
        error.message === "You are not authorized to manage this booking" ||
        error.message === "Cannot cancel booking after it has started" ||
        error.message === "Invalid status update for customer" || 
        error.message === "Invalid status update for admin" ||
        error.message === "Invalid role"
    ) {
        statusCode = 400; 
        if (error.message === "You are not authorized to manage this booking") statusCode = 403;
        if (error.message === "Booking not found") statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const bookingController = {
  createBooking,
  getBooking,
  updateBooking,
};
