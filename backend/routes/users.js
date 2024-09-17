const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//ユーザー情報の更新
router.put("/:id", async (req, res) => {
  console.log("更新APIを開始");
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      //PWのハッシュ化
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPw;

      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, { new: true });
      //ここで最新のuserを返す
      return res.status(200).json(user);

    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントのときだけ情報を更新できます");

  }
})

//PWのみ更新
router.put("/pwUpdate/:id", async (req, res) => {
  console.log("PW更新APIを開始");
  console.log("paramsid", req.params.id);
  console.log("req.body", req.body);
  try {
    const existUser = await User.findById(req.params.id);
    if (!existUser) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    //PWのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPw;

    //更新
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true })
      .select("-password"); //パスワードを除外して返す

    return res.status(200).json(updatedUser);

  } catch (err) {
    return res.status(500).json(err);
  }
})

//ユーザー情報の削除
router.delete("/:id", async (req, res) => {
  console.log("deleteAPIに到達しました");
  // console.log(req.body.userId);
  // console.log(req.params.id );
  // console.log(req.body.userId === req.params.id);

  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const posts = await Post.deleteMany({ userId: req.params.id });
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザーとその投稿が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントのときだけ情報を削除できます")
  }
});

//ユーザー情報の取得
router.get("/:id", async (req, res) => { //「:id」には任意のidが入る
  try {
    const user = await User.findById(req.params.id);

    //分割代入して、必要な情報とそうでない情報を分ける
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// router.get("/", (req, res) => {
//     res.send("user router");
//   });

module.exports = router;