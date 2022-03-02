import gulp from "gulp";
import del from "del";
import { config } from "../index.js";

const clean = async () => {
  await del("./third_party/**/*", { cwd: config.path.output });
};

const jquery = async () => {
  return gulp
    .src("./jquery/dist/**/*", { cwd: config.path.node_modules })
    .pipe(gulp.dest("./third_party/jquery", { cwd: config.path.output }));
};

const popper = async () => {
  return gulp
    .src("./popper.js/dist/**/*", { cwd: config.path.node_modules })
    .pipe(gulp.dest("./third_party/popper.js", { cwd: config.path.output }));
};

const bootstrap = async () => {
  return gulp
    .src("./bootstrap/dist/**/*", { cwd: config.path.node_modules })
    .pipe(gulp.dest("./third_party/bootstrap", { cwd: config.path.output }));
};

const fontAwesome = async () => {
  return gulp
    .src("./font-awesome/**/*", { cwd: config.path.node_modules })
    .pipe(gulp.dest("./third_party/font-awesome", { cwd: config.path.output }));
};

const copyThirdParty = gulp.series(
  clean,
  jquery,
  popper,
  bootstrap,
  fontAwesome
);
export default copyThirdParty;
