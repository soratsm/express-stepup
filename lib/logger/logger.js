import log4js from "log4js";
import config from "../../config/log4js.config.js";
import levels from "log4js/lib/levels.js";

log4js.configure(config);

// それぞれのログ種別ごとに作成
const console = log4js.getLogger();
const system = log4js.getLogger("system");
const access = log4js.getLogger("access");

// アプリケーションロガー拡張
class ApplicationLogger {
  constructor() {
    this.logger = log4js.getLogger("application");
  }
}
const proto = ApplicationLogger.prototype;
for (let level of levels.levels) {
  // log4jsのソースコード見ると、大文字になっているので小文字にします。
  level = level.toString().toLowerCase();
  proto[level] = (function (level) {
    return function (key, message) {
      const logger = this.logger;
      logger.addContext("key", key); // logger.Context("key", "test") で実装していたところをこちらで任意の値が設定できるようにする
      logger[level](message);
    };
  })(level);
}
// 新たにロガーを生成
const application = new ApplicationLogger();

export default {
  console,
  system,
  application,
  access,
};
