import cors from "cors";
import express, { Request, Response } from "express";
import errorHandler from "./app/middlewears/ErrorHandler";
import router from "./app/routes";


const app = express();
const port = 3000;

// Middleware setup
app.use(cors({ origin: "http://localhost:3000" }));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//application routes
app.use("/api/v1", router);


const getController = (req: Request, res: Response) => {
  res.send("Hello World!");
};

app.get("/", getController);
app.use(errorHandler);

export default app;
