import buildConfig from "./buildConfig.mjs";
import esbuild from "esbuild";

esbuild.build({
  ...buildConfig,
  watch: true,
});