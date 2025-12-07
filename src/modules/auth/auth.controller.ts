import { Request, Response } from "express";
import { authService } from "./auth.service";

const signIn = async (req: Request, res: Response) => {
  const payload = req.body;

  try {
    const result = await authService.signIn(payload as Record<string, any>);
    
    if (!result) {
        return res.status(404).json({
            success: false,
            message: "User not found or password incorrect",
        });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
    let statusCode = 500;
    if (
        error.message === "Email is required and must be in lowercase" || 
        error.message === "Password must be longer than 6 characters" ||
        error.message === "Role must be either 'admin' or 'customer'" ||
        error.message === "User with this email already exists"
    ) {
        statusCode = 400;
    }
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? error.message : "Failed to register user",
      error: statusCode === 500 ? error.message : undefined,
    });
  }
};
export const authController = {
  signIn,
  signUp,
};
