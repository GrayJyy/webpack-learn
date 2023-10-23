const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const os = require('os')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { join } = require('path')

const threads = os.cpus().length // cpu 核数
function getStyleLoader(pre) {
  return [
    // use 执行顺序为从右到左 - 先执行css-loader再执行style-loader
    MiniCssExtractPlugin.loader,
    'css-loader', // 将 css 资源编译成commonjs 的模块到 js 中
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env', // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    pre,
  ].filter(Boolean) // 过滤掉不传的 undefined 情况
}
module.exports = {
  // 入口(规定为相对路径)
  entry: './src/main.js',
  // 输出(规定为绝对路径)
  output: {
    // 文件的输出路径
    path: `${join(__dirname, '../dist')}`,
    // 入口 js 文件的输出文件名
    filename: 'static/js/[name].js',
    // contenthash 根据文件内容输出哈希值
    // 给打包输出的其他文件命名
    chunkFilename: 'static/js/[name].[contenthash:6].chunk.js',
    // 图片 字体 音视频等通过 type:assert处理的资源的统一命名
    assetModuleFilename: 'static/media/[name].[contenthash:6][ext][query]',
    // 在生成文件之前清空 output 目录
    clean: true,
  },
  // loader
  module: {
    rules: [
      {
        oneOf: [
          // loader 配置
          {
            test: /\.css$/i, // 只检测.css结尾的文件
            // loader string 只能使用单个 loader
            // loader:''
            // use [] 可以使用多个 loader
            use: getStyleLoader(),
          },
          {
            test: /\.less$/i,
            use: getStyleLoader('less-loader'),
          },
          {
            test: /\.s[ac]ss$/i,
            use: getStyleLoader('sass-loader'),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader('stylus-loader'),
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
            // generator: {
            //   // 图片资源输出文件名 name是原先的文件名 hash是 dist 生成图片后的前缀(:10是取 hash 前十位,简短方便) hash 值，ext 是拓展名，query 是参数
            //   filename: 'static/images/[name].[hash:10][ext][query]',
            // },
          },
          {
            // 在这里处理了包括字体 音频 视频等其他资源
            test: /\.(ttf|woff2?|map4|map3|avi)$/,
            type: 'asset/resource', // asset/resource 相当于`file-loader`, 将文件转化成 Webpack 能识别的资源，其他不做处理
            // generator: {
            //   filename: 'static/media/[hash:8][ext][query]',
            // },
          },
          {
            test: /\.m?js$/,
            exclude: /(node_modules)/, //node_modules文件不处理,因为一般第三方库都已经处理过了
            use: [
              {
                loader: 'thread-loader', // 开启多进程，必须在需要处理的 loader 之前
                options: {
                  works: threads, // 进程数量
                },
              },
              {
                loader: 'babel-loader',
                // options 可以写在外面的配置文件上 方便管理
                options: {
                  // presets: ['@babel/preset-env'], // 这一块写在外面了
                  cacheDirectory: true, // 开启 babel 缓存
                  cacheCompression: false, // 关闭 缓存文件压缩，节约时间 因为这块只是占据电脑的硬盘 关闭可以空间换时间
                  plugins: ['@babel/plugin-transform-runtime'], // 减少代码体积
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // plugin
  plugins: [
    // plugin 配置
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].chunk.css',
    }),
    new ESLintPlugin({
      context: join(__dirname, '../src'), // 表示检测 src 下的文件
      // exclude: /node_modules/, // 排除 node_modules 下的文件，是默认值，可以省略写法 ： new ESLintPlugin(join(__dirname, '../src'))
      cache: true, // 开启 eslint 结果缓存
      cacheLocation: join(__dirname, '../node_modules/.cache/eslintCache'), // 设置缓存位置
      threads, // eslint 开启直接配置threads 核心数即可
    }),
    new HtmlWebpackPlugin({
      // 如果不写这个template 配置，那么原来在index.html里写的 dom 结构是不会自动引入的
      template: join(__dirname, '../public/index.html'), // 以当前工作目录下的 public/index.html文件为模版创建新的html 文件，这个新的文件结构和模板的一样，并且会自动引入打包的资源(入口 js 文件)
    }),
  ],
  // 压缩优化相关配置 webpack5 推荐写法
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 开启 css 压缩，html 和 js 压缩在生产模式下默认开启，不需要额外配置
      // terser 压缩和优化 JavaScript 代码
      // webpack5 对 js 的优化是默认开启的，一般不需要写，但是当项目越来越庞大需要进一步提升性能时，需要开启多线程，就需要手动写上这个配置了
      // 每个 worker 都是一个独立的 node.js 进程，其开销大约为 600ms 左右。同时会限制跨进程的数据交换 请仅在耗时的操作中使用此 loader
      new TerserWebpackPlugin({
        parallel: threads, // 开启多进程压缩
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              [
                'svgo',
                {
                  plugins: [
                    'preset-default',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical',
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 单入口文件 代码分割操作
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`,
    },
  },
  // 生产模式不需要开发服务器 只需要打包输出文件
  //   devServer: {
  //     host: 'localhost', // 启动服务器域名
  //     port: '3000', // 启动服务器端口号
  //     open: true, // 是否自动打开浏览器
  //   },
  // 模式
  mode: 'production',
  devtool: 'source-map', // 有行列映射，缺点是编译打包速度慢
}
