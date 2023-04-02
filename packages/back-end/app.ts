import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ result: 1 });
});

export default app;
