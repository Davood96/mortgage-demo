// istanbul ignore file
import express, { Express } from "express";
import cors from "cors";
import { calculatePayment, parseAndValidateParams } from "./calculator.service";

const app: Express = express();

app.use(cors());
app.get("/calculate", (req, res) => {
  const parseResult = parseAndValidateParams(req.query);

  if (parseResult.success === false) {
    res.status(400).json({ error: parseResult.error });
  } else {
    res.status(200).json({ result: calculatePayment(parseResult.params) });
  }
});

export default app;
