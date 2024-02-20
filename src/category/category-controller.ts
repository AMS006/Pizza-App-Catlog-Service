import { NextFunction, Response } from "express";
import { CategoryService } from "./category-service";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CategoryRequest } from "./category-type";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger
    ) {
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    async create(req: CategoryRequest, res: Response, next: NextFunction) {
        const validataionResult = validationResult(req);
        if (!validataionResult.isEmpty()) {
            return next(createHttpError(400, validataionResult.array()[0].msg as string))
        }

        const category = await this.categoryService.create(req.body);
        this.logger.info(`Category created: ${category.id}`);
        res.status(201).json(category);
    }

    async getAll(req: CategoryRequest, res: Response) {
        this.logger.info("Get all categories");
        const categories = await this.categoryService.getAll();
        res.status(200).json(categories);
    }

    async getById(req: CategoryRequest, res: Response, next: NextFunction) {
        const category = await this.categoryService.getById(req.params.id);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }
        res.status(200).json(category);
    }

    async update(req: CategoryRequest, res: Response, next: NextFunction) {
        const validataionResult = validationResult(req);
        if (!validataionResult.isEmpty()) {
            return next(createHttpError(400, validataionResult.array()[0].msg as string))
        }

        const { id } = req.params;
        if (!id) return next(createHttpError(400, "Id is required"));

        const category = await this.categoryService.update(id, req.body);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }
        res.status(200).json(category);
    }

    async delete(req: CategoryRequest, res: Response, next: NextFunction) {
        const { id } = req.params;
        if (!id) return next(createHttpError(400, "Id is required"));
        const category = await this.categoryService.delete(id);
        if (!category) {
            return next(createHttpError(404, "Category not found"));
        }
        res.status(204).send();
    }
}