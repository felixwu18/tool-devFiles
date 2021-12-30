const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HappyPack = require('happypack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var glob = require('glob');
var pages = getEntry('./src/**/*.html');
var happyThreadPool = HappyPack.ThreadPool({ size: 1 })
require("babel-polyfill")

var plugins = [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    favicon: 'favicon.ico',
    inject: true
}),
new HappyPack({
    id: 'babel-application-js',
    threadPool: happyThreadPool,
    loaders: ['babel-loader?cacheDirectory']
}),
new CopyPlugin([
    {
        from: path.resolve(__dirname, '../assets/image'),
        to: 'assets/image',
        ignore: ['.*']
    }, {
        from: path.resolve(__dirname, '../assets/resource'),
        to: 'assets/resource',
        ignore: ['.*']
    }
]),
new VueLoaderPlugin(),
new webpack.DefinePlugin({
    'process.env.baseurl': JSON.stringify('pages/'),
    'process.env.sourceurl': JSON.stringify('assets/'),
    'process.env.develop': false
}),
// new ExtractTextPlugin({
//     filename: 'css/[name].css',
//     allChunks: true
// }),
new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash].css',
    chunckFilename: '[id].[contenthash].css'
}),
new OptimizeCssAssetsPlugin(),
new ParallelUglifyPlugin({
    // 传递给 UglifyJS 的参数
    uglifyES: {
        output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
        },
        compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句，可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
        }
    },
})
]


function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[pathname] = entry;
    });
    return entries;
}


for (var pathname in pages) {
    // 配置生成的html文件，定义路径等
    var conf = {
        filename: pages[pathname].replace('/src', '/pages'),
        template: pages[pathname], // 模板路径
        minify: { //传递 html-minifier 选项给 minify 输出
            removeComments: true
        },
        inject: false
    };
    plugins.push(new HtmlWebpackPlugin(conf))
}

module.exports = {
    entry: {
        main: ['babel-polyfill', './src/main.ts']
    },
    mode: 'production',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
                /*  options: vueLoaderConfig*/
            },
            {
                test: /\.js$/,
                use: 'happypack/loader?id=babel-application-js',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10,
                    name: 'image/[name].[contenthash].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|TTF)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[contenthash].[ext]'
                }
            },
            {
                test: /\.(mp3)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'audio/[name].[contenthash].[ext]'
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]-[hash:base64:5]',
                        },
                    }, {
                        loader: 'px2rem-loader', options: {
                            remUnit: 20
                        }
                    }, 'postcss-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    { loader: 'css-loader' },
                    {
                        loader: 'px2rem-loader', options: {
                            remUnit: 20
                        }
                    }, 'postcss-loader']
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            }
        ]
    },
    node: {
        fs: 'empty'
    },
    resolve: {
        extensions: [
            '.ts', '.json', '.js', '.tsx'
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    output: {
        filename: 'js/[name]_[contenthash].js',
        // chunkFilename: 'js/[name].chunk.js',
        path: path.resolve(__dirname, '../dist'),
        libraryTarget: "umd",
    },
    plugins: plugins,
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 6,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
}