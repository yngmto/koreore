const router = require("express").Router();
const User = require("../models/User");
const PreUser = require("../models/PreUser");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
require("dotenv").config();

//仮登録
router.post("/preRegister", async (req, res) => {
    console.log("仮登録APIに到達しました");
    try {
        const registeredUser = await User.findOne({ email: req.body.email });
        const preRegisteredUser = await PreUser.findOne({ email: req.body.email });
        // console.log("registeredUser:",registeredUser);
        const frontendUrl = process.env.FRONTEND_URL;
        console.log("frontendUrl",frontendUrl);
        if (registeredUser) {
            console.log("このユーザーは既に存在します");
            //リダイレクト準備
            return res.json({
                success: true,
                redirectTo: `${frontendUrl}/registered/`
            });
        } else if (preRegisteredUser) {
            console.log("このユーザーは既に仮登録済みです")
            return res.json({
                success: true,
                redirectTo: `${frontendUrl}/preUserExist/`
            });
        }

        const newPreUser = await new PreUser({
            email: req.body.email,
            uuid: uuidv4(),
        });
        const user = await newPreUser.save();
        await sendVerificationEmail(newPreUser.email, newPreUser.uuid);
        return res.status(200).json(newPreUser)

    } catch (err) {
        return res.status(500).json(err);
    }
});

//PW更新
router.post("/pwForgot", async (req, res) => {
    console.log("PW更新APIに到達しました");
    try {
        //登録済か引っ張ってくる
        const registeredUser = await User.findOne({ email: req.body.email });
        const preRegisteredUser = await PreUser.findOne({ email: req.body.email });

        if (!registeredUser) {
            console.log("このメールアドレスは登録されていません");
            //リダイレクト準備
            const frontendUrl = process.env.FRONTEND_URL;;
            return res.json({
                success: false
                //リダイレクトさせる
            });
        } else if (preRegisteredUser) {
            console.log("このユーザーには既にメールをお送りしています");
            //リダイレクト準備
            const frontendUrl = process.env.FRONTEND_URL;;
            return res.json({
                success: false
                //リダイレクトさせる
            });
        }

        //
        const pwUpdateUser = await new PreUser({
            email: req.body.email,
            uuid: uuidv4(),
        });
        const user = await pwUpdateUser.save();
        await sendPwUpdateEmail(pwUpdateUser.email, pwUpdateUser.uuid);
        return res.status(200).json(pwUpdateUser);

    } catch (err) {
        return res.status(500).json(err);
    }
});


//Nodemailerの設定
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

//メール送信関数
async function sendVerificationEmail(to, code) {
    const API_URL = process.env.REACT_APP_API_URL;
    console.log("メール送信関数に到達しました API_URL = ",API_URL);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "これおれがわるいんか？：メールアドレスの確認",
        html: `
      <p>仮登録いただきありがとうございます。</p>
      <p>以下のリンクをクリックして、本登録へお進みください。</p>
      <a href="${API_URL}/pre/verify/${code}">新規登録</a>
    `
    }
    // console.log(mailOptions);

    try {
        await transporter.sendMail(mailOptions);
        console.log("認証メールを送信しました");
    } catch (err) {
        console.log("メール送信中にエラーが発生しました", err);
    }
}
async function sendPwUpdateEmail(to, code) {
    const API_URL = process.env.REACT_APP_API_URL;
    console.log("PwUpdateメール送信関数に到達しました");
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: "これおれがわるいんか？：パスワード更新",
        html: `
      <p>以下のリンクをクリックして、パスワード更新画面へお進みください。</p>
      <a href="${API_URL}/pre/pwUpdate/${code}">パスワード更新</a>
    `
    }
    console.log(mailOptions);

    try {
        await transporter.sendMail(mailOptions);
        console.log("認証メールを送信しました");
    } catch (err) {
        console.log("メール送信中にエラーが発生しました", err);
    }
}

//認証コードを照合(ユーザー登録用)
router.get("/verify/:code", async (req, res) => {
    console.log("verify(GET) APIに到達");
    try {
        //コードを受け取る
        const code = req.params.code;
        console.log("code:", code);

        //PreUserの中に、同じコードを持ったユーザーがいるか確認
        const user = await PreUser.findOne({ uuid: code });
        console.log("user:", user);

        if (user) { //ユーザーがいるなら、新規登録APIに飛ばす
            console.log("ユーザーが見つかりました");
            //userを安全な形式に変換
            const encodeUser = Buffer.from(JSON.stringify(user)).toString("base64");
            //リダイレクト準備
            const frontendUrl ="https://koreore.vercel.app";
            // console.log("encodeUser:",encodeUser);
            return res.redirect(`${frontendUrl}/register/?user=${encodeUser}`);
        } else {
            console.log("ユーザーが見つかりません");
        }

        return res.status(200).json();

    } catch (err) {
        return res.status(500).json(err);
    }
})
//認証コードを照合(PW更新用)
router.get("/pwUpdate/:code", async (req, res) => {
    console.log("verify(GET) APIに到達");
    try {
        //コードを受け取る
        const code = req.params.code;
        console.log("code:", code);

        //PreUserの中に、同じコードを持ったユーザーがいるか確認
        const user = await PreUser.findOne({ uuid: code });
        console.log("user:", user);

        if (user) { //ユーザーがいるなら、新規登録APIに飛ばす
            console.log("ユーザーが見つかりました");
            //userを安全な形式に変換
            const encodeUser = Buffer.from(JSON.stringify(user)).toString("base64");
            //リダイレクト準備
            const frontendUrl =process.env.FRONTEND_URL;;
            // console.log("encodeUser:",encodeUser);
            return res.redirect(`${frontendUrl}/pwUpdate/?user=${encodeUser}`);
        } else {
            console.log("ユーザーが見つかりません");
        }

        return res.status(200).json();

    } catch (err) {
        return res.status(500).json(err);
    }
})

//新規登録後完了後にpreUserを削除
router.delete("/delete", async (req, res) => {
    const email = req.body.email;
    console.log("PreのdeleteAPIに到達しました");
    console.log("req.body.email:",email);
    try {
        const user = await PreUser.findOneAndDelete({email:email});
        return res.status(200).json({ message: "削除完了",deleteuser:user});
    } catch (err) {
        return res.status(500).json({err:err});
    }
});


module.exports = router;