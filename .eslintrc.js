module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base', // 继承 airbnb 标准
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest', // 最新的es 语法版本  也可以写 6 直接用 es6
    sourceType: 'module', // ES 模块化
    ecmaFeatures: {
      // ES 其他特性
      jsx: true, // 如果是 React 项目，就需要开启 jsx 语法
    },
  },
  rules: {
    semi: 0,
    ignoreComments: true,
  },
}
