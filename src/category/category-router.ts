import { Router } from "express";
import { CategoryController } from "./category-controller";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import categoryValidator from "./category-validator";
import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";

const router = Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);

router.post(
    "/",
    authenticate,
    categoryValidator,
    asyncWrapper(categoryController.create),
);

router.get("/", asyncWrapper(categoryController.getAll));

router.get("/:id", asyncWrapper(categoryController.getById));

router.put(
    "/:id",
    authenticate,
    categoryValidator,
    asyncWrapper(categoryController.update),
);

router.delete("/:id", authenticate, asyncWrapper(categoryController.delete));

export default router;
