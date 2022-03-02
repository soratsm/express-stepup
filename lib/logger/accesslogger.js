import log4js from "log4js";
import logger from "./logger.js";

export default (options) => {
  options = options || {};
  options.level = options.level || "auto";
  return log4js.connectLogger(logger.access, options);
};
