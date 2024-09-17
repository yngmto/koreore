const mongoose = require("mongoose");

const PreUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    uuid:{
        type: String,
        max: 50,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h' // 24時間後に自動削除
    }
},
{timestamps: true} //作成日時と更新日時を保存
);

// TTLインデックスの設定
PreUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // 86400秒 = 24時間

module.exports = mongoose.model("PreUser", PreUserSchema);