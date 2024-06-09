import ProductModel from "../product/product-model";
import CategoryModel from "./category-model";
import {
    CategoryType,
    Filters,
    GetCategoryResponse,
    Pagination,
} from "./category-type";

export class CategoryService {
    async create(category: CategoryType) {
        const newCategory = new CategoryModel(category);
        await newCategory.save();
        return newCategory;
    }

    async getAll(filters: Filters, pagination: Pagination) {
        const skip = (pagination.page - 1) * pagination.limit;

        const pipeline = [
            {
                $match: filters,
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: pagination.limit }],
                    total: [{ $count: "total" }],
                },
            },
            {
                $project: {
                    data: 1,
                    total: { $arrayElemAt: ["$total.total", 0] },
                },
            },
        ];

        const result = await CategoryModel.aggregate(pipeline);

        return result[0] as GetCategoryResponse;
    }

    async getById(id: string) {
        return CategoryModel.findById(id);
    }

    async update(id: string, category: CategoryType) {
        return CategoryModel.findByIdAndUpdate(id, category, { new: true });
    }

    async delete(id: string) {
        const isProductExists = await ProductModel.exists({ categoryId: id });
        if (isProductExists) {
            throw new Error("Cannot delete category because it has products");
        }
        return CategoryModel.findByIdAndDelete(id);
    }
}
