import mongoose from "mongoose";
import { Attribute, CategoryType, PriceConfigration } from "./category-type";

const priceConfigrationSchema = new mongoose.Schema<PriceConfigration>({
    priceType: {
        type: String,
        required: true,
        enum: ["base", "additional"],
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const attributeSchema = new mongoose.Schema<Attribute>({
    name: {
        type: String,
        required: true,
    },
    widgetType: {
        type: String,
        required: true,
        enum: ["radio", "switch"],
    },
    defaultValue: {
        type: String,
        required: true,
    },
    availableOptions: {
        type: [String],
        required: true,
    },
});

const categorySchema = new mongoose.Schema<CategoryType>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigrationSchema,
        required: true,
    },
    attributes: {
        type: [attributeSchema],
        required: true,
    },
});

const CategoryModel = mongoose.model<CategoryType>("Category", categorySchema);

export default CategoryModel;
