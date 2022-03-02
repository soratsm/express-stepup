import gulp from "gulp";
import uglify from "gulp-uglify";
import del from "del";
import { config } from "../index.js";

const clean = async () => {
  await del("./javascripts/**/*", { cwd: config.path.output });
};

const minify = async () => {
  return gulp.src("./javascripts/**/*", { cwd: config.path.input })
    .pipe(uglify(config.uglify))
    .pipe(gulp.dest("./javascripts", { cwd: config.path.output }));
};

const minifyJavascripts = gulp.series(clean, minify);
export default minifyJavascripts;
