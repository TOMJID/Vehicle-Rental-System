import express, { Request, Response } from "express";
import { ENV } from "./config/dotenv.config";
import { initDB } from "./config/db.config";

const PORT = ENV.port;

const app = express();

//? initialize database
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/`);
});
