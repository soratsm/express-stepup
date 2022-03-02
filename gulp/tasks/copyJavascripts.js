import gulp from "gulp";
import del from "del";
import { config } from "../index.js";

const clean = async () => {
  await del("./javascripts/**/*", { cwd: config.path.output });
};

const copy = async () => {
  return gulp
    .src("./javascripts/**/*", { cwd: config.path.input })
    .pipe(gulp.dest("./javascripts", { cwd: config.path.output }));
};

const copyJavascripts = gulp.series(clean, copy);
export default copyJavascripts;
