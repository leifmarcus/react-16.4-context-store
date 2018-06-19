const path    = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const SRC_DIR = `${__dirname}/src`;
const PUBLIC_PATH = '/';
const OUTPUT_DIR = 'dist';

module.exports = {
    mode : 'development',

    entry : {
        'js/react-context-test'   : './src/index.js',
    },

    output : {
        // options related to how webpack emits results

        path       : path.resolve( __dirname, OUTPUT_DIR ), // string

        filename        : '[name]-[hash].js',
        chunkFilename   : '[name]-[hash].js',
        publicPath      : PUBLIC_PATH,
    },

    devtool : 'cheap-eval-source-map',

    module : {
        rules : [
            {
                test    : /\.jsx?/,
                use     : [
                    {
                        loader : 'babel-loader',
                    },
                ],
                include : SRC_DIR,
            },
            {
                test    : /\.css$/i,
                include : SRC_DIR,
                use     : [ {
                    loader : 'style-loader',    // creates style nodes from JS strings
                }, {
                    // translates CSS into CommonJS
                    loader  : 'css-loader',
                    options : {
                        minimize        : true,
                        modules         : true,
                        localIdentName  : '[name]__[local]--[hash:base64:4]',
                        importLoaders   : 1,
                        root            : '.',
                        url             : true,
                    },
                } ],
            },
        ],
    },
    resolve : {
        modules : [
            'node_modules',
            path.resolve( __dirname, 'src' ),
        ],
        alias   : {
            config : path.resolve( __dirname, './config.json' ),
        },
    },

    context   : __dirname, // string (absolute path!)
    target    : 'web',
    devServer : {
        contentBase        : path.join( __dirname, 'public' ),
        compress           : true, // enable gzip compression
        historyApiFallback : true, // true for index.html upon 404, object for multiple paths
        hot                : true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https              : false, // true for self-signed, object for cert authority
        noInfo             : true, // only errors & warns on hot reload
        host               : '0.0.0.0',
        open                : false,
    },
    plugins : [

        new webpack.HotModuleReplacementPlugin(),

        new HtmlWebpackPlugin( {
            title    : 'Portfolio Monitor',
            template : 'src/index.html',
        } ),

        new CopyWebpackPlugin( [
            {
                from    : './src/data',
                to      : './data',
            },
        ] ),
    ],
};
