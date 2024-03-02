import express, { Request, Response } from "express";
import config from "config";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-routes";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();

app.use(express.json());

app.use("/category", categoryRouter);
app.use("/product", productRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: config.get("server.port") });
});

app.use(globalErrorHandler);

export default app;
