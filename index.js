import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import httpLogger from "./middleware/httpLogger.js";
import { haltOnTimedout, timeout120 } from './middleware/timeout-handler.js';

//Setup/initialize environment variables
dotenv.config();

const PORT = process.env.SERVER_PORT;
const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(httpLogger);//Http logging middleware

//Timeout Middleware
app.use(timeout120);
app.use(haltOnTimedout);

app.get("/", function (req, res) {
  res.send("Its working");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${process.env.SERVER_PORT}`);
});
