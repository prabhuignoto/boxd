module.exports = {
  root: true,

  env: {
    node: true,
  },

  // extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },

  parser: "vue-eslint-parser",
  parserOptions: {
    plugins: ["@typescript-eslint"],
    parser: "babel-eslint",
    ecmaVersion: 2020,
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/prettier",
    "plugin:@typescript-eslint/recommended",
  ],

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
