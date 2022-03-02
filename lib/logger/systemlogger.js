import logger from "./logger.js";

// 他のミドルウェアと記載を合わせるためファンクションを返す
export default (options) => {
  return (err, req, res, next) => {
    logger.system.error(err.message);
    next(err);
  };
};
