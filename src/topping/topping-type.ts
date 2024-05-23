import { Request } from "express";

export interface Topping {
    name: string;
    image: string;
    price: number;
    tenantId: string;
    tenantName: string;
    publicId: string;
}

export interface CreateToppingRequest extends Request {
    body: Topping;
}

export interface GetToppingsResponse {
    data: Topping[];
    total: number;
}
