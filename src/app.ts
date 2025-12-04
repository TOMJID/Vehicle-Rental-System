import express, { Request, Response } from "express";
import { initDB } from "./config/db.config";

const app = express();

//? initialize database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
