// webpack.config.js 

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const vueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.argv.indexOf('--mode=production') === -1;
// const Webpack = require('webpack');

module.exports = {
    // mode: 'development',  // 开发模式
    entry: {  // 入口文件, 一般js 为入口文件，js文件中引用的图片，css 或者其他文件会按照下面定义的 rule 进行打包
        main: path.resolve(__dirname, '../src/main.js'),  
        header: path.resolve(__dirname, '../src/header.js'),  
    },
    // entry: ["@babel/polyfill,path.resolve(__dirname,'../src/main.js')"],  // ？
    output: {
        filename: '[name].[hash:8].js',  // 打包后的文件名称
        path: path.resolve(__dirname, '../dist')  // 打包后的目录
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            chunks: ['main']  // 与入口文件对应的模块名
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/header.html'),
            filename: 'header.[hash:8].html',
            chunks: ['header']  // 与入口文件对应的模块名
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash:8].css',
            chunkFilename: devMode ? '[id].css' : '[id].css',
        }),
        new vueLoaderPlugin(),
        // new Webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] // 从右向左解析原则,直接把CSS放在<style>中
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 
                        options: {
                            publicPath: '../dist/css/',
                            hmr: devMode
                        }
                    }, // 把css 放在.css 文件中，然后在<head>中<link>中引用.css文件
                    'css-loader',
                    'less-loader',
                ]
                // use: ['style-loader', 'css-loader', 
                // {
                //     loader: 'postcss-loader',
                //     options: {
                //         plugins: [require('autoprefixer')]
                //     }
                // },
                // 'less-loader'] // 从右向左解析原则
            },
            {
                test: /\.(jpe?g|png|gif)$/i, // 图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 媒体文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,  // 字体
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader', // babel-loader只会将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等)
                    options: {
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: ['vue-loader'],
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '@': path.resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.json', '.vue']
    },
    // devServer: {
    //     port: 3000,
    //     hot: true,
    //     contentBase: '../dist/',
    // }
    
}