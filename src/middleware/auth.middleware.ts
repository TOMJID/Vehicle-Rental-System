import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/dotenv.config";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization;

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
    const decodedToken = jwt.verify(token, secretKey);
    console.log(decodedToken);
    next();
  };
};

export default auth;
