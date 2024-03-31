import mongoose, { Schema } from "mongoose";

const priceConfigrationSchema = new Schema({
    priceType: {
        type: String,
        enum: ["base", "additional"],
    },
    availableOptions: {
        type: Map,
        of: Number,
    },
});

const attributeValueSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
});

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
        },
        tenantId: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },

        priceConfiguration: {
            type: Map,
            of: priceConfigrationSchema,
        },
        attributes: [attributeValueSchema],
    },
    { timestamps: true },
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
