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

export const authController = {
  signIn,
};
