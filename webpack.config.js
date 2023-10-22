const ESLintPlugin = require('eslint-webpack-plugin')
const { join } = require('path')

module.exports = {
  // 入口(规定为相对路径)
  entry: './src/main.js',
  // 输出(规定为绝对路径)
  output: {
    // 文件的输出路径
    path: `${join(__dirname, 'dist')}`,
    // 入口 js 文件的输出文件名
    filename: 'static/js/main.js',
    // 在生成文件之前清空 output 目录
    clean: true,
  },
  // loader
  module: {
    rules: [
      // loader 配置
      {
        test: /\.css$/i, // 只检测.css结尾的文件
        // loader string 只能使用单个 loader
        // loader:''
        // use [] 可以使用多个 loader
        use: [
          // use 执行顺序为从右到左 - 先执行css-loader再执行style-loader
          'style-loader', // 将 js 中的 css 通过创建 style 标签添加到 html 文件中生效
          'css-loader', // 将 css 资源编译成commonjs 的模块到 js 中
        ],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: 'asset', // 相当于`url-loader`, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
        parser: {
          dataUrlCondition: {
            // 小于 5kb 的图片转化为 base64 格式 优点：减少请求数 缺点：体积变大（原有图片体积越大，转换后增加的体积也越大）
            maxSize: 5 * 1024,
          },
        },
        generator: {
          // 图片资源输出文件名 name是原先的文件名 hash是 dist 生成图片后的前缀(:10是取 hash 前十位,简短方便) hash 值，ext 是拓展名，query 是参数
          filename: 'static/images/[name].[hash:10][ext][query]',
        },
      },
      {
        // 在这里处理了包括字体 音频 视频等其他资源
        test: /\.(ttf|woff2?|map4|map3|avi)$/,
        type: 'asset/resource', // asset/resource 相当于`file-loader`, 将文件转化成 Webpack 能识别的资源，其他不做处理
        generator: {
          filename: 'static/media/[hash:8][ext][query]',
        },
      },
    ],
  },
  // plugin
  plugins: [
    // plugin 配置
    // new ESLintPlugin(join(__dirname, 'src')), // 表示检测 src 下的文件
  ],
  // 模式
  mode: 'development',
}
