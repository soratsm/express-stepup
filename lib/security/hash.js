// パスワードのハッシュ化

import crypto from "crypto";
import appConfig from "../../config/app.config.js";
const { PASSWORD_SALT, PASSWORD_STRETCH } = appConfig.security;

const digest = function (text) {
  var hash;

  text += PASSWORD_SALT;

  // cryptoはストレッチングの回数生成する必要あり
  for (var i = PASSWORD_STRETCH; i--; ) {
    hash = crypto.createHash("sha256");
    hash.update(text);
    text = hash.digest("hex");
  }

  return text;
};

export default digest;
