module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/recommended", "@vue/prettier"],
  rules: {
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/eqeqeq": "error",
    "vue/v-on-function-call": "error",
    eqeqeq: "error",
    curly: "error"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
