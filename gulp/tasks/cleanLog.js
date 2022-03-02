import del from "del";

import { config } from "../index.js";

const cleanLog = async () => {
  await del("./**/*", { cwd: config.path.log });
};

export default cleanLog;
