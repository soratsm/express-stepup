import express from "express";
// coreモジュール
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

// csrf関連
import cookieParser from "cookie-parser";
import session from "express-session";
import appConfig from "./config/app.config.js";

// passport関連
// ログイン認証及び認可を担う
import flash from "connect-flash";
import accountcontrol from "./lib/security/accountcontrol.js";

import router from "./routes/index.js";
import routerPosts from "./routes/posts.js";
import routerSearch from "./routes/search.js";
import routerAccount from "./routes/account.js";
import routerApiPosts from "./api/posts.js";
import systemlogger from "./lib/logger/systemlogger.js";
import accesslogger from "./lib/logger/accesslogger.js";
import logger from "./lib/logger/logger.js";

// ここまでは固定
const app = express();

// バックエンドのフレームワーク等の隠蔽
app.disable("x-powered-by");

// ejs:jsp形式のHTML拡張による記述（この辺をreactに任せる予定）
app.set("view engine", "ejs");

// 静的ファイルの配信
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(
  "/public",
  express.static(
    __dirname +
      "/public/" +
      (process.env.NODE_ENV == "development" ? "development" : "production")
  )
);

// 静的ファイルに対しては不要なためこの位置で使用
app.use(accesslogger());

// csrf関連（正規ルートの繊維によって登録が行われたかを検証し、不正アクセスを防ぐ）
app.use(cookieParser());
const { SESSION_SECRET } = appConfig.security;
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sid",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passport関連（ログイン周り）
app.use(flash());
app.use(...accountcontrol.initialize());


// ルーティングを簡単にやるなら下記書き方で十分
// app.use("/", router);
// カスタムヘッダーによるアクセス制御を実装する
// なぜ必要か？クリックジャッキングという脆弱性で半透明化したほかサイトを表面上に表示させ、予期しない操作をさせる
// 注意点："/"が先に来るとそちらに引っかかるため後ろにずらず
app.use(
  "/api",
  (() => {
    let customRouter = express.Router();
    customRouter.use("/posts", routerApiPosts);
    return customRouter;
  })()
);

app.use(
  "/",
  (() => {
    let customRouter = express.Router();
    customRouter.use((req, res, next) => {
      // DENY:拒否 / SAMEORIGIN:同一生成元のみ許可。それ以外は拒否
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      next();
    });
    customRouter.use("/posts/", routerPosts);
    customRouter.use("/search/", routerSearch);
    customRouter.use("/account/", routerAccount);
    customRouter.use("/", router);
    return customRouter;
  })()
);


app.use(systemlogger());
// logger.application.error("test", "message2");


// 404（Not Found）:リクエスト情報を表示する
app.use((req, res, next) => {
  var data = {
    method: req.method,
    protocol: req.protocol,
    version: req.httpVersion,
    url: req.url,
  };
  res.status(404);
  // req.xhr:ajaxによるアクセスか判定
  if (req.xhr) {
    res.json(data);
  } else {
    res.render("./404.ejs", { data });
  }
});

// 500（Internal Server Error）:リクエスト情報とエラー情報を表示する
app.use((err, req, res, next) => {
  var data = {
    method: req.method,
    protocol: req.protocol,
    version: req.httpVersion,
    url: req.url,
    error:
      process.env.NODE_ENV === "development"
        ? {
            name: err.name,
            message: err.message,
            stack: err.stack,
          }
        : undefined,
  };
  res.status(500);
  if (req.xhr) {
    res.json(data);
  } else {
    res.render("./500.ejs", { data });
  }
});


app.listen(3000);
