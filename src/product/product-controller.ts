import { NextFunction, Request, Response } from "express";
import { Product } from "./product-type";
import { ProductService } from "./product-service";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
    ) {}

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        const validataionResult = validationResult(req);
        if (!validataionResult.isEmpty()) {
            return next(
                createHttpError(
                    400,
                    validataionResult.array()[0].msg as string,
                ),
            );
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            image,
        } = req.body as Product;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            tenantId,
            categoryId,
            image,
        };

        const createdProduct = await this.productService.createProduct(product);

        this.logger.info("Prouct Created", { id: createdProduct._id });
        res.status(201).json({ product: createdProduct });
    };

    getProducts = async (req: Request, res: Response) => {
        const products = await this.productService.getProducts();
        res.status(200).json(products);
    };

    getProductById = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const id = req.params.id;

        if (!id) {
            res.status(400).json({ message: "Id is required" });
        }

        const product = await this.productService.getProductById(id);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }
        res.status(200).json(product);
    };

    deleteProduct = async (req: Request, res: Response) => {
        await this.productService.deleteProduct(req.params.id);

        this.logger.info("Prouct Deleted", { id: req.params.id });
        res.status(204).send();
    };

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        const validataionResult = validationResult(req);
        if (!validataionResult.isEmpty()) {
            return next(
                createHttpError(
                    400,
                    validataionResult.array()[0].msg as string,
                ),
            );
        }

        const { id } = req.params;

        if (!id) return next(createHttpError(400, "Id is required"));
        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            image,
        } = req.body as Product;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            tenantId,
            categoryId,
            image,
        };

        const updateProduct = await this.productService.updateProduct(
            id,
            product,
        );

        if (!updateProduct) {
            return next(createHttpError(404, "Product not found"));
        }

        this.logger.info("Prouct Updated", { id: updateProduct._id });

        res.status(200).json({ updateProduct });
    };
}
