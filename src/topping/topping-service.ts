import { Filters, Pagination } from "../product/product-type";
import ToppingModel from "./topping-model";
import { GetToppingsResponse, Topping } from "./topping-type";

export class ToppingService {
    async createTopping(topping: Topping) {
        return await ToppingModel.create(topping);
    }

    async getToppings(filters: Filters, pagination: Pagination) {
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

        const result = await ToppingModel.aggregate(pipeline);

        return result[0] as GetToppingsResponse;
    }

    async deleteTopping(toppingId: string) {
        return await ToppingModel.findByIdAndDelete(toppingId);
    }
}
