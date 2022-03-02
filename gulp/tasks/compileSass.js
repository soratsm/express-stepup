import gulp from "gulp";
import gulpSass from "gulp-sass";
import pkgSass from "sass";
import del from "del";
import { config } from "../index.js";

const sass = gulpSass(pkgSass);

const clean = async () => {
  await del("./stylesheets/**/*", { cwd: config.path.output });
};

const compile = async () => {
  return gulp
    .src("./stylesheets/**/*.scss", { cwd: config.path.input })
    .pipe(sass(config.sass))
    .pipe(gulp.dest("./stylesheets", { cwd: config.path.output }));
};

const compileSass = gulp.series(clean, compile);
export default compileSass;
