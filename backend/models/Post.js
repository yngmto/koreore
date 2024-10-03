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

PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", PostSchema);