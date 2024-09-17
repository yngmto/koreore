const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    birthday: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean, //管理者か否か
        default: false,
    },
},
    { timestamps: true } //作成日時と更新日時を保存
);


module.exports = mongoose.model("User", UserSchema);