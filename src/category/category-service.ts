import CategoryModel from "./category-model";
import { CategoryType } from "./category-type";

export class CategoryService {
    async create(category: CategoryType) {
        const newCategory = new CategoryModel(category);
        await newCategory.save();
        return newCategory;
    }

    async getAll() {
        return CategoryModel.find();
    }

    async getById(id: string) {
        return CategoryModel.findById(id);
    }

    async update(id: string, category: CategoryType) {
        return CategoryModel.findByIdAndUpdate(id
            , category
            , { new: true });
    }

    async delete(id: string) {
        return CategoryModel.findByIdAndDelete(id);
    }
}