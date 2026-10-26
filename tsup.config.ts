import { defineConfig } from "tsup";

const componentEntries = {
  "table/index": "src/table/index.ts",
  "modal/index": "src/modal/index.ts",
  "sidebar/index": "src/sidebar/index.ts",
  "toast/index": "src/toast/index.ts",
};

export default defineConfig({
  entry: {
    ...componentEntries,
    styles: "src/styles.css",
    "table/styles": "src/table/styles.css",
    "modal/styles": "src/modal/styles.css",
  },
  format: ["esm", "cjs"],
  dts: { entry: componentEntries },
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime", /^motion(?:\/|$)/],
});
