import { Request, Response } from "express";
import { userService } from "./user.service";

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
        message: "User doesn't exist",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User found",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//? update user according to id
const updateUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const payload = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const result = await userService.updateUserById(
      Number(userId),
      payload,
      user as { id: number; role: string }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    let statusCode = 500;
    if (error.message === "User not found") statusCode = 404;
    if (error.message === "You are not authorized to update this profile")
      statusCode = 403;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

//? delete user by id
const deleteUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await userService.deleteUserById(userId as any);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    if (error.message === "Cannot delete user with active bookings") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
