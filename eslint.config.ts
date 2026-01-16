import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["**/.vscode/**", "**/node_modules/**", "**/dist/**", "**/package-lock.json"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"].map((config) => ({ ...config, files: ["**/*.vue"] })),
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.jsonc", "**/tsconfig*.json"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"], rules: { "css/no-invalid-at-rules": "off" } },
  {
		rules: {
      "semi": "off",
      "no-unused-vars": "off",
      "vue/multi-word-component-names": "off"
		},
	},
]);
