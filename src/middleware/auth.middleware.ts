import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/dotenv.config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;

    try {
      //? check if auth token is present
      if (!authToken) {
        return res.status(401).json({ message: "You are not Authorized" });
      }

      //? extract token from Bearer <token>
      const tokens = authToken.split(" ");

      //? check if token format is valid
      if (tokens.length !== 2 || tokens[0] !== "Bearer") {
        return res
          .status(401)
          .json({ message: "Invalid Authorization header format" });
      }

      //? get the token part
      const token = tokens[1]!;

      //? verify auth token
      const secretKey = ENV.jwtSecret;
      const decodedToken = jwt.verify(token, secretKey) as JwtPayload;

      //? adding user info to request object
      req.user = decodedToken as JwtPayload;

      //? check for user role authorization
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
