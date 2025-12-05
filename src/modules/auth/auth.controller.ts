import { Request, Response } from "express";
import { authService } from "./auth.service";

const signIn = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const result = await authService.signIn(payload as Record<string, any>);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "User account not found",
    });
  }
};

const signUp = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const result = await authService.signUp(payload);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};
export const authController = {
  signIn,
  signUp,
};
