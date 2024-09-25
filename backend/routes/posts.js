const express = require('express');
const router = require("express").Router();
const Post = require("../models/Post");

//投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//投稿を更新する
// router.put("/:id", async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (post.userId === req.body.userId) {
//             await post.updateOne({
//                 $set: req.body,
//             });
//             return res.status(200).json("投稿編集に成功しました！");
//         } else {
//             return res.status(403).json("あなたは他の人の投稿を編集できません")
//         }
//     } catch (err) {
//         return res.status(403).json(err);
//     }
// })

//投稿を削除する
router.delete("/", async (req, res) => {
    try {
        console.log("---ポスト削除APIに到達---");
        console.log("ポストID:", req.query.id);

        const post = await Post.findById(req.query.id);
        console.log("postのuserId", post.userId);

        if (post.userId === req.query.userId) {
            await post.deleteOne();
            return res.status(200).json("投稿削除に成功しました！");
        } else {
            return res.status(403).json("あなたは他の人の投稿を削除できません")
        }
    } catch (err) {
        return res.status(403).json(err);
    }
})

//MYPOSTを１件取得する
router.get("/mypost/:id", async (req, res) => {
    console.log("---mypostAPIに到達---")
    try {
        const post = await Post.findOne(
            { userId: req.params.id }, //特定のidでフィルタリング
            {}, //全てのフィールドを取得
            { sort: { createdAt: -1 } });
        console.log("取得したpost:", post);
        return res.status(200).json(post);

    } catch (err) {
        return res.status(403).json(err);
    }
})

//MYPOSTを10件取得する
router.get("/myposts/:id", async (req, res) => {
    console.log("---mypostsAPIに到達---")
    const lastTime =
        req.query.lastTime ? new Date(req.query.lastTime) : null;

    try { //投稿を10件取得
        let posts;
        if (!lastTime) { //最初の読込の場合
            posts = await Post
                .find({ userId: req.params.id })
                .sort({ createdAt: -1 })
                .limit(10);
        } else {
            posts = await Post
                .find({
                    createdAt: { $lt: lastTime }, //less than比較演算子
                    userId: req.params.id
                })
                .sort({ createdAt: -1 })
                .limit(10);
        }
        return res.status(200).json(posts);

    } catch (err) {
        return res.status(403).json(err);
    }
})


//投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);

    } catch (err) {
        return res.status(403).json(err);
    }
})

//特定の投稿に「わるくない」を押す
router.put("/:id/warukunai", async (req, res) => {
    console.log("---「わるくない」APIに到達---");

    try {
        const post = await Post.findById(req.params.id);
        const userId = req.body.userId;

        //もし「う～ん」が押されているなら、それを外す
        if (post.warui.includes(userId)) {
            // console.log("既に「う～ん」が押されています");
            await post.updateOne({
                $pull: {
                    warui: userId,
                },
                $push: {
                    warukunai: userId,
                },
            });
            return res.status(200).json("投稿から「う～ん」を外し、「わるくない」を押しました");
        }
        //まだ投稿に「わるくない」が押されていなかったら
        if (!post.warukunai.includes(userId)) {
            // console.log("まだ「わるくない」は押されていません");
            await post.updateOne({
                $push: {
                    warukunai: userId,
                },
            });
            return res.status(200).json("投稿に「わるくない」を押しました！");
        } else { //既に押されていたらユーザーIDを取り除く
            // console.log("既に「わるくない」は押されています");
            await post.updateOne({
                $pull: {
                    warukunai: userId,
                },
            });
            return res.status(200).json("投稿から「わるくない」を外しました");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//特定の投稿に「う～ん」を押す
router.put("/:id/warui", async (req, res) => {
    console.log("---「う～ん」APIに到達---");

    try {
        const post = await Post.findById(req.params.id);
        const userId = req.body.userId;

        //もし「わるくない」が押されているなら、それを外す
        if (post.warukunai.includes(userId)) {
            // console.log("既に「わるくない」が押されています");
            await post.updateOne({
                $pull: {
                    warukunai: userId,
                },
                $push: {
                    warui: userId,
                },
            });

            return res.status(200).json("投稿から「わるくない」を外し、「う～ん」を押しました");
        }

        //まだ押されていなかったら
        if (!post.warui.includes(req.body.userId)) {
            // console.log("まだ「う～ん」は押されていません");
            await post.updateOne({
                $push: {
                    warui: userId,
                },
            });
            return res.status(200).json("投稿に「う～ん」を押しました！");

        } else { //既に押されていたらユーザーIDを取り除く
            // console.log("既に「う～ん」が押されています");
            await post.updateOne({
                $pull: {
                    warui: userId,
                },
            });
            return res.status(200).json("投稿から「う～ん」を外しました");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//タイムラインの投稿を取得する
router.get("/timeline/all", async (req, res) => {
    console.log("TLを取得します");
    const lastTime =
        req.query.lastTime ? new Date(req.query.lastTime) : null;
    // console.log("lastTime:", lastTime);

    try { //投稿を10件取得
        let posts;
        if (!lastTime) { //最初の読込の場合
            posts = await Post
                .find()
                .sort({ createdAt: -1 })
                .limit(10);
        } else {
            posts = await Post
                .find({ createdAt: { $lt: lastTime } }) //less than比較演算子
                .sort({ createdAt: -1 })
                .limit(10);
        }
        return res.status(200).json(posts);
    } catch (err) {
        console.error("エラーが発生いたしました:", err);
        return res.status(500).json({
            message: "サーバーエラーでございます", error: err.message
        });
    }
})



module.exports = router;