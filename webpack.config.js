var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
var TEM_PATH = path.resolve(APP_PATH, 'templates');

module.exports = {
    devtool:false,
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    //entry: APP_PATH,
    entry: {
        app: path.resolve(APP_PATH, 'routes.js')
    },
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: BUILD_PATH,
        //注意 我们修改了bundle.js 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，这里就是(app.js,mobile.js和vendors.js)
        //filename: '[name].js'
        filename: 'bundle.js'
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    devtool: 'eval-source-map',
    module: {
        //和loaders一样的语法，很简单
        perLoaders: [
            {
                test: /\.jsx?$/,
                include: APP_PATH,
                loader: 'jshint-loader'
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: APP_PATH
                //有了.babelrc文件，就不用写query
                /*query: {
                    presets: ['es2015','react']
                }*/
            },
            /*{
                test: /\.jsx?$/,
                loaders: ['es3ify-loader'],
            },*/
            { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /tether\.js$/, loader: "expose?Tether" },
            {test: /\.(jpg|png|gif)$/, loader: "file"},
            { test:/\.(woff|svg|ttf|eot|woff2)$/,loader:'url-loader?limit=10000'}
            /*{
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }*/
        ]
    },
    //配置jshint的选项，支持es6的校验
    jshint: {
        "esnext": true
    },
    //这里还需要添加一个resolve的参数，把jsx这种扩展名添加进去，这样就可以在js中import加载jsx这种扩展名的脚本
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    //添加我们的插件 会自动生成一个html文件
    plugins: [
        new HtmlwebpackPlugin({
            title: 'app',
            template: path.resolve(TEM_PATH, 'index.html'),
            //引用模板文件名
            filename: 'index.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
           // chunks: ['app', 'vendors'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};