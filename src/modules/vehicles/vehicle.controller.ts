import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

//? create vehicle
const createVehicle = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const result = await vehicleService.createVehicle(payload);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    let statusCode = 500;
    if (
      error.message === "Vehicle with this registration number already exists" ||
      error.message === "Daily rent price must be a positive number" ||
      error.message.includes("Type must be one of the following") ||
      error.message.includes("Availability status must be one of the following")
    ) {
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

///? get all vehicles
const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//? grt dingle vehicle
const getSingleVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehicleService.getSingleVehicle(vehicleId as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "this Id doesn't exist",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle found",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//? update vehicle
const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const payload = req.body;

  try {
    const result = await vehicleService.updateVehicle(
      vehicleId as string,
      payload
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//? delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleService.deleteVehicle(vehicleId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
