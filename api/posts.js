// Create:Post / Read:Get / Update:Put / Delete:Delete
// [/api/複数形/xxx]が基本

// ステータスコード
// 100番台:情報 / 200番台: 成功 / 300番台: リダイレクト
// 400番台:クライアントサイドに起因するERROR（selectの条件不正等）
// 500番台:サーバーサイドに起因するERROR（DB接続エラー等）

import express from "express";
import { MongoClient } from "mongodb";

import config from "../config/mongodb.config.js";
const { CONNECTION_URL, OPTIONS, DATABSE } = config;

const router = express.Router();

router.get("/*", (req, res) => {
  MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
    var db = client.db(DATABSE);
    db.collection("posts")
      .findOne(
        {
          url: req.url,
        },
        {
          // mongoDBのオプションで不要なものを削除可能
          projection: { _id: 0 },
        }
      )
      .then((doc) => {
        // jsonで返す
        res.json(doc);
      })
      .catch((error) => {
        throw error;
      })
      .then(() => {
        client.close();
      });
  });
});

export default router;
