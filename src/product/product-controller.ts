import { NextFunction, Request, Response } from "express";
import { Filters, Product } from "./product-type";
import { ProductService } from "./product-service";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import CloudinaryUpload from "../common/services/CloudinaryUpload";

export class ProductController {
    constructor(
        private productService: ProductService,
        private logger: Logger,
        private cloudinaryUpload: CloudinaryUpload,
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
        } = req.body as Product;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const isPublished = req.body.isPublished === "true" ? true : false;

        const image = req.files?.image as UploadedFile;

        if (!image) {
            return next(createHttpError(400, "Image is required"));
        }

        // Upload image to cloud
        const filePath = `RestaurantManagment/products`;
        const [url, publicId] = await this.cloudinaryUpload.upload(
            image.data,
            filePath,
        );

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            tenantId,
            categoryId,
            image: url,
            publicId,
            isPublished,
        };

        const createdProduct = await this.productService.createProduct(product);

        this.logger.info("Prouct Created", { id: createdProduct._id });
        res.status(201).json(createdProduct);
    };

    getProducts = async (req: Request, res: Response) => {
        const { search, tenantId, categoryId, isPublished } = req.query;

        const filters: Filters = {};

        if (search) filters.name = { $regex: search as string, $options: "i" };
        if (tenantId) filters.tenantId = tenantId as string;
        if (
            categoryId &&
            mongoose.Types.ObjectId.isValid(categoryId as string)
        ) {
            filters.categoryId = new mongoose.Types.ObjectId(
                categoryId as string,
            );
        }
        if (isPublished) filters.isPublished = isPublished === "true";

        const pagination = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        };

        const products = await this.productService.getProducts(
            filters,
            pagination,
        );

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

    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        const product = await this.productService.deleteProduct(req.params.id);

        if (!product) {
            return next(createHttpError(404, "Product not found"));
        }

        if (product.publicId !== undefined) {
            await this.cloudinaryUpload.delete(product.publicId);
        }

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

        if (!id) return next(createHttpError(400, "Product Id is required"));

        const isProductExist = await this.productService.getProductById(id);

        if (!isProductExist) {
            return next(createHttpError(404, "Product not found"));
        }

        let newImage = isProductExist.image;
        let newPublicId = isProductExist.publicId;

        if (req.files?.image) {
            const image = req.files?.image as UploadedFile;
            const filePath = `RestaurantManagment/products`;
            const [url, publicId] = await this.cloudinaryUpload.upload(
                image.data,
                filePath,
            );
            await this.cloudinaryUpload.delete(newPublicId as string);
            newImage = url;
            newPublicId = publicId;
        }

        const {
            name,
            description,
            priceConfiguration,
            attributes,
            tenantId,
            categoryId,
            isPublished,
        } = req.body as Product;

        const product = {
            name,
            description,
            priceConfiguration: JSON.parse(priceConfiguration) as string,
            attributes: JSON.parse(attributes) as string,
            tenantId,
            categoryId,
            image: newImage,
            publicId: newPublicId,
            isPublished,
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
