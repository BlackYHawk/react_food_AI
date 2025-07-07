import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import parserTypeScript from "@typescript-eslint/parser";
import pluginReactNative from "eslint-plugin-react-native";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        // CommonJS
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        // Node.js
        process: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        // Browser
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        // ES2021
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        // React Native specific globals
        __DEV__: "readonly",
        __fbBatchedBridgeConfig: "readonly",
        __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
        jest: "readonly",
        expect: "readonly",
      },
    },
    plugins: {
      react: pluginReact,
      "@typescript-eslint": pluginTypeScript,
      "react-native": pluginReactNative,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginTypeScript.configs.recommended.rules,
      // ...pluginReactNative.configs.all.rules, // Temporarily disable all rules from react-native plugin
      // Custom rules
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-undef": "off",
      "react/prop-types": "off", // Disable prop-types for React Native with TypeScript
      "react-native/no-inline-styles": "off", // Disable inline styles for now
      "react-native/no-color-literals": "off", // Disable color literals for now
      "react-native/sort-styles": "off", // Disable sort styles for now
      "@typescript-eslint/no-require-imports": "error", // Enable this rule
      "@typescript-eslint/no-explicit-any": "warn", // Warn for any
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Warn for unused vars, ignore args starting with _
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }], // Allow ts-ignore with description
      "no-useless-escape": "warn", // Warn for useless escapes
      "@typescript-eslint/no-unused-expressions": "warn", // Warn for unused expressions
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["metro.config.js", "babel.config.js", "jest.config.js", ".prettierrc.js", "src/mock/mock.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        module: "writable",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
];