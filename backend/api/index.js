const express = require("express");
const app = express();
const usersRoute = require("../routes/users");
const authRoute = require("../routes/auth");
const postsRoute = require("../routes/posts");
const preRoute = require("../routes/pre");
const mongoose = require("mongoose");
const path = require('path');
require("dotenv").config();

//DB接続
mongoose
.connect(process.env.MONGOURL)
.then(() => {
  console.log("DB接続成功")})
.catch((err)=>{console.log(err)});

//---ミドルウェア---
app.use(express.json());

//各リクエストのログを出力
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/pre", preRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('サーバーエラーが発生いたしました');
});

// クライアントのビルドフォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, '../client/build')));

//※Vercelでは、静的ファイルは
//.vercel/output/static ディレクトリに配置する必要がある。
// その他のルートはReactアプリにリダイレクト
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });

// Vercelでのデプロイ時には不要？
// app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server is running`);
// });

//ローカル時
//const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
//});

module.exports = app;
