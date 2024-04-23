import fileUpload from "express-fileupload";
import { asyncWrapper } from "../common/utils/wrapper";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import { Router } from "express";
import productValidator from "./create-product-validator";
import logger from "../config/logger";
import authenticate from "../common/middlewares/authenticate";
import CloudinaryUpload from "../common/services/CloudinaryUpload";
import updateProductValidator from "./update-product-validator";
import createHttpError from "http-errors";
import canAccess from "../common/middlewares/canAccess";
import { Roles } from "../common/utils/constants";

const router = Router();

const productService = new ProductService();
const cloudinaryUpload = new CloudinaryUpload();
const productController = new ProductController(
    productService,
    logger,
    cloudinaryUpload,
);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 1 * 1024 * 1024 }, // 1MB,
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, "File must be less than 1MB"));
        },
    }),
    productValidator,
    asyncWrapper(productController.createProduct),
);

router.get("/", asyncWrapper(productController.getProducts));

router.get("/:id", asyncWrapper(productController.getProductById));

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(productController.deleteProduct),
);

router.put(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 1 * 1024 * 1024 }, // 1MB,
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            next(createHttpError(400, "File must be less than 1MB"));
        },
    }),
    updateProductValidator,
    asyncWrapper(productController.updateProduct),
);

export default router;
