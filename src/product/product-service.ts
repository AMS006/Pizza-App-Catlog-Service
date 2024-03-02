import ProductModel from "./product-model";
import { Product } from "./product-type";

export class ProductService {
    async createProduct(product: Product) {
        return await ProductModel.create(product);
    }
    async getProducts() {
        return await ProductModel.find();
    }
    async getProductById(productId: string) {
        return await ProductModel.findById(productId);
    }
    async updateProduct(productId: string, product: Product) {
        return await ProductModel.findByIdAndUpdate(productId, product, {
            new: true,
        });
    }
    async deleteProduct(productId: string) {
        return await ProductModel.findByIdAndDelete(productId);
    }
}
