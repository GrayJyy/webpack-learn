module.exports = {
  // 智能预设 已经安装对应依赖 能够编译 es6 语法使其能用在旧版本浏览器上
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: { version: '3', proposals: true },
      },
    ],
  ],
}
