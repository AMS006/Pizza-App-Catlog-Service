import mongoose from "mongoose";

export interface Product {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    image?: string;
    publicId?: string;
    isPublished: boolean;
    isToppingAvailable?: boolean;
}

export interface Filters {
    name?: { $regex: string; $options: string };
    tenantId?: string;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}

export interface Pagination {
    page: number;
    limit: number;
}

export interface GetProductsResponse {
    data: Product[];
    total: number;
}
