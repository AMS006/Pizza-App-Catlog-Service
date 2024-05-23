import { NextFunction, Request, Response } from "express";
import { ToppingService } from "./topping-service";
import { CreateToppingRequest } from "./topping-type";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import CloudinaryUpload from "../common/services/CloudinaryUpload";
import { Filters } from "../product/product-type";

export class ToppingController {
    constructor(
        private toppingService: ToppingService,
        private cloudinaryUpload: CloudinaryUpload,
    ) {}
    createTopping = async (
        req: CreateToppingRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const image = req.files?.image as UploadedFile;

        if (!image) {
            return next(createHttpError(400, "Image is required"));
        }

        // Upload image to cloud
        const filePath = `RestaurantManagment/Toppings`;
        const [url, publicId] = await this.cloudinaryUpload.upload(
            image.data,
            filePath,
        );

        const topping = {
            ...req.body,
            image: url,
            publicId,
        };

        const newTopping = await this.toppingService.createTopping(topping);
        res.status(201).json(newTopping);
    };

    getToppings = async (req: Request, res: Response) => {
        const { search, tenantId } = req.query;

        const filters: Filters = {};

        if (search) {
            filters.name = { $regex: search as string, $options: "i" };
        }
        if (tenantId) {
            filters.tenantId = tenantId as string;
        }

        const pagination = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
        };

        const toppings = await this.toppingService.getToppings(
            filters,
            pagination,
        );
        return res.status(200).json(toppings);
    };
    deleteTopping = async (req: Request, res: Response) => {
        const toppingId = req.params.id;
        await this.toppingService.deleteTopping(toppingId);
        res.status(200).json({ message: "Topping deleted successfully" });
    };
}
