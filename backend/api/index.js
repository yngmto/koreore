const express = require("express");
const app = express();
const usersRoute = require("../routes/users");
const authRoute = require("../routes/auth");
const postsRoute = require("../routes/posts");
const preRoute = require("../routes/pre");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");


//DB接続
const MONGOURL = process.env.MONGOURL;
// console.log("MONGOURL",MONGOURL);
mongoose
.connect(MONGOURL)
.then(() => {
  console.log("DB接続成功")})
.catch((err)=>{console.log("errが発生しました",err)});

//CORS
app.use(cors({
  //このURLからのリクエストのみを許可
  origin: ["https://koreore.vercel.app","http://localhost:3000"],
  //クッキーやHTTP認証などの認証情報を含むリクエストを許可
  credentials: true,
  //許可するメソッド
  methods: ["GET", "POST", "PUT", "DELETE"],
  //クライアントが送信できるヘッダー
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//---ミドルウェア---
app.use(express.json());

//各リクエストのログを出力
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

///頭の"/api"を削除
app.use("/users", usersRoute);
app.use("/auth", authRoute);
app.use("/posts", postsRoute);
app.use("/pre", preRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("サーバーエラーが発生いたしました");
});

// クライアントのビルドフォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, "../client/build")));

//※Vercelでは、静的ファイルは
//.vercel/output/static ディレクトリに配置する必要がある。
// その他のルートはReactアプリにリダイレクト
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

//ローカル時
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});

//ルートパスのハンドラー
app.get("/", (req, res) => {
  res.send("Welcome to my backend!");
});

module.exports = app;