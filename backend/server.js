const express = require("express");
const app = express();
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const preRoute = require("./routes/pre");
const mongoose = require("mongoose");
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

// クライアントのビルドフォルダを静的ファイルとして提供
app.use(express.static(path.join(__dirname, '../client/build')));

// その他のルートはReactアプリにリダイレクト
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('サーバーエラーが発生いたしました');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//以下、ビルド設定
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
