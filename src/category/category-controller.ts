import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category-service";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger
    ) {
        this.create = this.create.bind(this);
    }
    async create(req: Request, res: Response, next: NextFunction) {
        const validataionResult = validationResult(req);
        if (!validataionResult.isEmpty()) {
            return next(createHttpError(400, validataionResult.array()[0].msg as string))
        }
        try {
            const category = await this.categoryService.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            this.logger.error(error);
            next(createHttpError(500, 'Something went wrong'));
        }
    }
}