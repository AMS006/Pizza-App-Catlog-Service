import mongoose from "mongoose";

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    tenantId: {
        type: String,
        required: true,
    },
    tenantName: {
        type: String,
        required: true,
    },
});

const ToppingModel = mongoose.model("Topping", toppingSchema);

export default ToppingModel;
