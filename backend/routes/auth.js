const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//ユーザー登録
router.post("/register", async (req, res) => {
  console.log("registerAPIに到達しました");
  try {
    //PWのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPw;
    console.log(req.body);

    //Userの保存
    const newUser = await new User({
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      birthday: req.body.birthday,
    });
    const user = await newUser.save();
    return res.status(200).json(newUser);//200←すべてうまくいってるよ

  } catch (err) {
    return res.status(500).json(err); //500←サーバー関連のエラー
  }
});

//ログイン
router.post("/login", async (req, res) => {
  console.log("---loginAPIに到達---");
  try {
    //アドレスからUserを取得
    const user = await User.findOne({ email: req.body.email }); //Userを探す関数

    //Userがいなければ
    if (!user) return res.status(404).send("ユーザーが見つかりません");

    //パスワードを比較
    const vailedPassword = await bcrypt.compare(req.body.password, user.password);
    console.log("valid", vailedPassword);

    //false
    if (!vailedPassword) return res.status(400).json("パスワードが違います");

    //true
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err); //500←サーバー関連のエラー
  }
})

// router.get("/", (req, res) => {
//     res.send("auth routereeeeeeeeeee");
//   });

module.exports = router;