module.exports = {
  root: true,

  env: {
    node: true
  },

  // extends: ["plugin:vue/essential", "@vue/prettier"],
  extends: ["plugin:vue/essential"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        mocha: true
      }
    }
  ]
};
