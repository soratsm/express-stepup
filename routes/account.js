import express from "express";
const router = express.Router();
import { MongoClient } from "mongodb";

import config from "../config/mongodb.config.js";
const { CONNECTION_URL, OPTIONS, DATABSE } = config;

import accountcontrol from "../lib/security/accountcontrol.js";

import Tokens from "csrf";
const tokens = new Tokens();

var validateRegistData = function (body) {
  var isValidated = true,
    errors = {};

  if (!body.url) {
    isValidated = false;
    errors.url = "URLが未入力です。'/'から始まるURLを入力してください。";
  }

  if (body.url && /^\//.test(body.url) === false) {
    isValidated = false;
    errors.url = "'/'から始まるURLを入力してください。";
  }

  if (!body.title) {
    isValidated = false;
    errors.title = "タイトルが未入力です。任意のタイトルを入力してください。";
  }

  return isValidated ? undefined : errors;
};

var createRegistData = function (body) {
  var datetime = new Date();
  return {
    url: body.url,
    published: datetime,
    updated: datetime,
    title: body.title,
    content: body.content,
    keywords: (body.keywords || "").split(","),
    authors: (body.authors || "").split(","),
  };
};

router.get(
  "/",
  accountcontrol.authorize("readWrite"),
  (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/account/login");
    }
  },
  (req, res) => {
    res.render("./account/index.ejs");
  }
);

router.get("/login", (req, res) => {
  res.render("./account/login.ejs", { message: req.flash("message") });
});

router.post("/login", accountcontrol.authenticate());

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/account/login");
});

router.get(
  "/posts/regist",
  accountcontrol.authorize("readWrite"),
  (req, res) => {
    tokens.secret((error, secret) => {
      // csrfのトークン生成
      var token = tokens.create(secret);
      req.session._csrf = secret;
      res.cookie("_csrf", token);
      res.render("./account/posts/regist-form.ejs");
    });
  }
);

router.post(
  "/posts/regist/input",
  accountcontrol.authorize("readWrite"),
  (req, res) => {
    var original = createRegistData(req.body);
    res.render("./account/posts/regist-form.ejs", { original });
  }
);

router.post(
  "/posts/regist/confirm",
  accountcontrol.authorize("readWrite"),
  (req, res) => {
    var original = createRegistData(req.body);
    var errors = validateRegistData(req.body);
    if (errors) {
      res.render("./account/posts/regist-form.ejs", { errors, original });
      return;
    }
    res.render("./account/posts/regist-confirm.ejs", { original });
  }
);

router.post(
  "/posts/regist/execute",
  accountcontrol.authorize("readWrite"),
  (req, res) => {
    // csrfのトークン検証
    var secret = req.session._csrf;
    var token = req.cookies._csrf;
    // 正規ルート以外ならERRORをスロー
    if (tokens.verify(secret, token) === false) {
      throw new Error("Invalid Token.");
    }

    var original = createRegistData(req.body);
    var errors = validateRegistData(req.body);

    if (errors) {
      res.render("./account/posts/regist-form.ejs", { errors, original });
      return;
    }

    MongoClient.connect(CONNECTION_URL, OPTIONS, (error, client) => {
      var db = client.db(DATABSE);
      db.collection("posts")
        .insertOne(original)
        .then(() => {
          // csrfのトークンを削除（一回使ったら削除する）
          delete req.session._csrf;
          res.clearCookie("_csrf");

          // リダイレクトにより静的ページに遷移することでF5キー押下による再送信防止
          res.redirect("/account/posts/regist/complete");
        })
        .catch((error) => {
          throw error;
        })
        .then(() => {
          client.close();
        });
    });
  }
);

router.get(
  "/posts/regist/complete",
  accountcontrol.authorize("readWrite"),
  (req, res) => {
    res.render("./account/posts/regist-complete.ejs");
  }
);

export default router;
