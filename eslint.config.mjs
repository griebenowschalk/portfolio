import webConfig from "./apps/web/eslint.config.mjs";
import cmsConfig from "./apps/cms/eslint.config.js";
import apiConfig from "./apps/api/eslint.config.cjs";

export default [
  ...webConfig,
  ...cmsConfig,
  ...apiConfig,
];

