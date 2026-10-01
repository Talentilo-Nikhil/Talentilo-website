import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The promo film's handoff, vendored for provenance. Its own README says it plainly: "they
    // are not production code to ship directly". It is a prototype carrying React 18 globals, a
    // scrubber and a tweaks panel, and it is kept beside the port so the two can be compared —
    // linting it reports on a file nobody is going to change.
    "design/promo/**",
  ]),
]);

export default eslintConfig;
