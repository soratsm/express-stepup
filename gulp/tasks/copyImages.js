import gulp from "gulp";
import del from "del";
import { config } from "../index.js";

const clean = async () => {
  await del("./images/**/*", { cwd: config.path.output });
};

const copy = async () => {
  return gulp
    .src("./images/**/*", { cwd: config.path.input })
    .pipe(gulp.dest("./images", { cwd: config.path.output }));
};

const copyImages = gulp.series(clean, copy);
export default copyImages;
