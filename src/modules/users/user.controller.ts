import { Request, Response } from "express";
import { userService } from "./user.service";

//? create a new user controller
const createUser = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const result = await userService.createUser(payload);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    //? this for password validation
    if (error.message === "Password must be longer than 6 characters") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    //? for all other errors
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

//? get all users controller
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {}
};

//? get single user by id controller
const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await userService.getUserById(userId as unknown as number);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User found",
        data: result.rows[0],
      });
    }
  } catch (error: any) {}
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
};
