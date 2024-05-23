import { Request } from "express";

export interface PriceConfigration {
    [key: string]: {
        priceType: "base" | "aditional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "radio" | "switch";
    defaultValue: string;
    availableOptions: string[];
}
export interface CategoryType {
    name: string;
    priceConfiguration: PriceConfigration;
    attributes: Attribute[];
}

export interface CategoryRequest extends Request {
    body: CategoryType;
}

export interface Filters {
    name?: { $regex: string; $options: string };
}
export interface Pagination {
    page: number;
    limit: number;
}

export interface GetCategoryResponse {
    data: CategoryType[];
    total: number;
}
