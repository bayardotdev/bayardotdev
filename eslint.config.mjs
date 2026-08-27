import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  ...eslintPluginAstro.configs.recommended,
  eslintConfigPrettier, // Disables all ESLint rules that might conflict with Prettier
  {
    rules: {
      // Custom lint rules here
    },
  },
];
