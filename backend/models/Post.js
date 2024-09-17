const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 200,
    },
    warukunai: {
        type: Array,
        default: [],
    },
    warui: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);