import { body } from "express-validator";

export default [
    body("name")
        .isString()
        .withMessage("Product name should be string")
        .notEmpty(),
    body("description")
        .isString()
        .withMessage("Product Description should be string")
        .notEmpty(),
    body("priceConfiguration")
        .exists()
        .withMessage("Price Configuration is required"),
    body("attributes").exists().withMessage("Attributes is required"),
    body("tenantId").isString().notEmpty().withMessage("Tenant Id is required"),
    body("categoryId")
        .isString()
        .notEmpty()
        .withMessage("Category Id is required"),
];
