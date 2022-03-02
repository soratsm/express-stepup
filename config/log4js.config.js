// ★システムログ：システムやアプリケーションのERRORを出力
//   1ファイルで一定容量でローテートするログ
//     type:"file"で固定
//     filename:出力ファイルへのパス
//     maxLogSize:ログファイルの最大サイズ(バイト)
//     backups:ログローテートする際の最大保持数
//     layout:出力レイアウト
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = path.join(__dirname, "../");

// ★アプリケーションログ：アプリケーションの稼働状況を出力するログ
//   機能ごとに出力するログ
//     type:"multiFile"で固定
//     base:出力ファイルの基本名
//     property:ログ分離する条件
//              組み込みはcategoryName,pid,level
//              上記以外はcontext mapから検索
//     extension:ログファイル名のサフィックス
//     layout:出力レイアウト

// アクセスログ：サーバーへのアクセス内容を出力するログ
//   日付ごとに分割して出力するログ（適しているのがDate Rolling File Appender）
//     type:"dateFile"で固定
//     filename:出力ファイルへのパス
//     pattern:ログローテートする際のサフィックス
//     daysToKeep:ログローテートする際の最大保持日数
//     layout:出力レイアウト
export default {
  appenders: {
    ConsoleLogAppender: {
      type: "console",
    },
    FileLogAppender: {
      type: "file",
      filename: path.join(ROOT, "./log/system/system.log"),
      maxLogSize: 5000000,
      bakups: 10,
    },
    MultiFileLogAppender: {
      type: "multiFile",
      base: path.join(ROOT, "./log/application/"),
      property: "key",
      extension: ".log",
    },
    DateRollingFileLogAppender: {
      type: "dateFile",
      filename: path.join(ROOT, "./log/access/access.log"),
      pattern: "-yyyyMMdd",
      daysToKeep: 30,
    },
  },
  categories: {
    default: {
      appenders: ["ConsoleLogAppender"],
      level: "ALL",
    },
    system: {
      appenders: ["FileLogAppender"],
      level: "ERROR",
    },
    application: {
      appenders: ["MultiFileLogAppender"],
      level: "ERROR",
    },
    access: {
      appenders: ["DateRollingFileLogAppender"],
      level: "INFO",
    },
  },
};
