import express, { Request, Response } from "express";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-routes";
import toppingRouter from "./topping/topping-routes";
import { globalErrorHandler } from "./common/middlewares/globalErrorHandler";

const app = express();

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        credentials: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/topping", toppingRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: config.get("server.port") });
});

app.use(globalErrorHandler);

export default app;
