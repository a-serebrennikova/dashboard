import js from "@eslint/js";
import { fileURLToPath } from "node:url";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

const ROOT_DIR = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/coverage/**",
    "**/node_modules/**",
    "**/*.d.ts",
    "**/*.{js,mjs,cjs}",
  ]),

  {
    files: ["packages/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: ROOT_DIR,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "TSAsExpression[typeAnnotation.type!='TSConstKeyword'][typeAnnotation.typeName.name!='const']",
          message:
            "Type assertion with 'as' is forbidden. Use explicit typing or runtime validation. If absolutely necessary, disable per line: eslint-disable-next-line no-restricted-syntax.",
        },
      ],
    },
  },

  {
    files: ["packages/backend/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["packages/shared/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["packages/**/*.{test,spec}.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  {
    files: ["packages/frontend/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]);
