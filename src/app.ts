import express, { Request, Response } from "express";
import config from 'config'
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.json({ message: config.get('port') });
});

app.use(globalErrorHandler);

export default app;
