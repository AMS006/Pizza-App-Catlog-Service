import { Router } from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import { ToppingController } from "./topping-controller";
import { ToppingService } from "./topping-service";
import authenticate from "../common/middlewares/authenticate";
import canAccess from "../common/middlewares/canAccess";
import createToppingValidator from "./create-topping-validator";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";
import CloudinaryUpload from "../common/services/CloudinaryUpload";
import { Roles } from "../common/utils/constants";

const router = Router();

const toppingService = new ToppingService();
const cloudinaryUpload = new CloudinaryUpload();

const toppingController = new ToppingController(
    toppingService,
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
    createToppingValidator,
    asyncWrapper(toppingController.createTopping),
);

router.get("/", asyncWrapper(toppingController.getToppings));

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    asyncWrapper(toppingController.deleteTopping),
);

export default router;
