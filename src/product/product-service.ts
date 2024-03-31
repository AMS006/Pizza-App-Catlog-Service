import ProductModel from "./product-model";
import {
    Filters,
    GetProductsResponse,
    Pagination,
    Product,
} from "./product-type";

export class ProductService {
    async createProduct(product: Product) {
        return (await ProductModel.create(product)) as Product;
    }
    async getProducts(filters: Filters, pagination: Pagination) {
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

        const result = await ProductModel.aggregate(pipeline);

        return result[0] as GetProductsResponse;
    }

    async getProductById(productId: string) {
        return (await ProductModel.findById(productId)) as Product;
    }
    async updateProduct(productId: string, product: Product) {
        return (await ProductModel.findByIdAndUpdate(productId, product, {
            new: true,
        })) as Product;
    }
    async deleteProduct(productId: string) {
        return (await ProductModel.findByIdAndDelete(productId)) as Product;
    }
}
