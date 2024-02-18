import CategoryModel from "./category-model";
import { CategoryType } from "./category-type";

export class CategoryService {
    async create(category: CategoryType) {
        const newCategory = new CategoryModel(category);
        await newCategory.save();
        return newCategory;
    }
}