import fileUpload from "express-fileupload";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import { Router } from "express";
import productValidator from "./product-validator";
import logger from "../config/logger";
import authenticate from "../common/middlewares/authenticate";

const router = Router();

const productService = new ProductService();
const productController = new ProductController(productService, logger);

router.post(
    "/",
    authenticate,
    fileUpload(),
    productValidator,
    asyncWrapper(productController.createProduct),
);

router.get("/", asyncWrapper(productController.getProducts));

router.get("/:id", asyncWrapper(productController.getProductById));

router.delete(
    "/:id",
    authenticate,
    asyncWrapper(productController.deleteProduct),
);

router.put(
    "/:id",
    authenticate,
    fileUpload(),
    productValidator,
    asyncWrapper(productController.updateProduct),
);

export default router;
