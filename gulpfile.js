import gulp from "gulp";
import {
  config,
  cleanLog,
  compileSass,
  copyThirdParty,
  copyImages,
  copyJavascripts,
  minifyJavascripts,
} from "./gulp/index.js";

const development = gulp.series(
  cleanLog,
  copyThirdParty,
  copyImages,
  copyJavascripts,
  compileSass
);

const production = gulp.series(
  cleanLog,
  copyThirdParty,
  copyImages,
  minifyJavascripts,
  compileSass
);

export default config.env.IS_DEVELOPMENT ? development : production;
