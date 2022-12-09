import buildConfig from "./buildConfig.mjs";
import esbuild from "esbuild";

esbuild.buildSync(buildConfig);