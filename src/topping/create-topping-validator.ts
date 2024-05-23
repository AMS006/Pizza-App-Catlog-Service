import { body } from "express-validator";

export default [
    body("name")
        .isString()
        .withMessage("Topping name should be string")
        .notEmpty(),
    body("price")
        .isNumeric()
        .withMessage("Topping price should be number")
        .notEmpty(),
    body("tenantId").isString().notEmpty().withMessage("Tenant Id is required"),
    body("tenantName")
        .isString()
        .notEmpty()
        .withMessage("Tenant Name is required"),
    body("image").custom((value, { req }) => {
        if (!req.files) {
            throw new Error("Image is required");
        }
        return true;
    }),
];
