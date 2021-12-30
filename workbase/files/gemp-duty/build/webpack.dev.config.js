const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
require("babel-polyfill")

module.exports = {
    entry: ['babel-polyfill', './src/main.ts'],
    mode: 'development',
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
                /*  options: vueLoaderConfig*/
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    // 'css-loader',
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
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',
                    {
                        loader: 'px2rem-loader', options: {
                            remUnit: 20
                        }
                    }]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: 'file-loader',
            }, {
                test: /\.(mp3)(\?.*)?$/,
                use: 'file-loader'
            }, {
                test: /\.(woff2?|eot|ttf|otf|TTF)(\?.*)?$/,
                use: 'url-loader',
            }
            // {
            //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            //     use: 'file-loader'
            // },
            // {
            //     test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            //     use: 'file-loader'
            // }
        ]
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
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "umd"
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    devServer: {
        contentBase: path.join(__dirname, '../src'),
        hot: true,
        open: true,
        port: 8083,
        host: '127.0.0.1',
        historyApiFallback: true,
        inline: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../assets'),
                to: 'assets',
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../assets/image'),
                to: 'assets/image',
                ignore: ['.*']
            }, {
                from: path.resolve(__dirname, '../assets/resource'),
                to: 'assets/resource',
                ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../assets/json'),
                to: 'assets/json',
                ignore: ['.*']
            }
        ]),
        new webpack.DefinePlugin({
            'process.env.baseurl': JSON.stringify('/gemp-duty/'),
            'process.env.sourceurl': JSON.stringify('/assets/'),
            'process.env.develop': true
        })
    ]
}
