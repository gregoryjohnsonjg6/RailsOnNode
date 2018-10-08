const webpack = require('webpack');
const noProduction = process.env.NODE_ENV !== 'production';
const WriteFilePlugin = require('write-file-webpack-plugin');
const TimeFixPlugin = require('time-fix-plugin');
const settings = require('./settings');
const fs = require('fs');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { reduce, camelCase } = require('lodash');

const vueJs = settings.jsType === 'vue';

const context = path.join(__dirname, '..');

const recursiveFind = (data, pathnm) => {
    fs.readdirSync(pathnm).forEach(dir => {
        if (dir !== `component.${settings.jsType}`) {
            if (fs.lstatSync(path.join(pathnm, dir)).isDirectory()) {
                recursiveFind(data, path.join(pathnm, dir));
            } else {
                const fullPath = path.join(pathnm, dir);

                const pageName = dir.split('.')[0];
                data[`${pathnm}/`] = {
                    pageName: pageName,
                    fullPath: fullPath,
                };
            }
        }
    });

    return data;
};

const apiVersions = require(path.join(context, 'controllers'));

const styleType = settings.styleType;
const jsType = settings.jsType;
const useBootstrapToggle = settings.useBootstrapToggle;

const cssPath = path.join(context, 'assets', styleType, 'pages');
const jsPath = path.join(context, 'assets', jsType, 'pages');

const cssPaths = Object.assign({}, reduce(recursiveFind({}, cssPath), (acc, val, key) => {
    acc[key] = { ...val, docs: !!apiVersions[val.pageName] };
    return acc;
}, {}));
const jsPaths = Object.assign({}, reduce(recursiveFind({}, jsPath), (acc, val, key) => {
    acc[key] = { ...val, docs: !!apiVersions[val.pageName] };
    return acc;
}, {}));

const jsLoader = settings.javascriptSettings[noProduction ? 'development': 'production'].map(e => {
    const includes = e.use.reduce((a, i) => {
        const include = i.loader === 'babel-loader' ? Object.keys(jsPaths)
            .concat(path.join(context, 'assets', jsType, 'redux', `store.${jsType}`)) : false;
        if (include) a = { include };
        return a;
    }, {});
    const test = e.test;
    const exclude = e.exclude;
    delete e.test;
    delete e.exclude;

    return {
        ...e,
        ...includes,
        test: new RegExp(test),
        exclude: new RegExp(exclude),
    }
});

const setByRoute = (data, object, assetType) => {
    const obj = data;
    for (let route in object) {
        const cssRegex = new RegExp(cssPath, 'ig');
        const jsRegex = new RegExp(jsPath, 'ig');
        const routePath = route.replace(cssRegex, '').replace(jsRegex, '') + object[route].pageName;

        if (assetType === 'javascript') {
            obj[routePath] = obj[routePath] || [];
            obj[routePath].push('webpack-hot-middleware/client');
            obj[routePath].push('babel-polyfill');
            if (object[route].docs && !useBootstrapToggle) {
                for (let setting in settings.bootstrap.scripts) {
                    obj[routePath].push(`${context}/node_modules/bootstrap/js/src/${setting}.js`);
                }
            }
            if (useBootstrapToggle) {
                for (let setting in settings.bootstrap.scripts) {
                    obj[routePath].push(`${context}/node_modules/bootstrap/js/src/${setting}.js`);
                }
                obj[routePath].push(object[route].fullPath);
            } else {
                obj[routePath].push(object[route].fullPath);
            }
        } else if (assetType === 'stylesheet') {
            obj[routePath] = obj[routePath] || [];
            if (object[route].docs && !useBootstrapToggle) {
                obj[routePath].push(`${context}/bootstrap/index.scss`);
                obj[routePath].push(`font-awesome-loader`);
            }
            if (useBootstrapToggle) {
                obj[routePath].push(`${context}/bootstrap/index.scss`);
                obj[routePath].push(`font-awesome-loader`);
                obj[routePath].push(object[route].fullPath);
            } else {
                obj[routePath].push(object[route].fullPath);
            }
        }
    }
    return obj;
};

const updateArray = (array) => {
    let firstItem = array.shift();
    const jsFiles = array.filter(e => e.endsWith('.js') || e.endsWith('.ts') || e.endsWith('.jsx') || e.endsWith('.vue'));
    const cssFiles = array.filter(e => e.endsWith('.css') || e.endsWith('.scss') || e.endsWith('.sass') || e.endsWith('.less'));
    firstItem = noProduction ? [firstItem] : [];
    return [].concat(firstItem).concat(cssFiles).concat(jsFiles);
};

const bundleJavaScriptLast = (routeObject) => {
    const obj = {};
    for (let route in routeObject) {
        obj[route] = updateArray(routeObject[route]);
    }
    return obj;
};

let withJavascripts = setByRoute({}, jsPaths, 'javascript');
let withStylesheets = setByRoute(withJavascripts, cssPaths, 'stylesheet');

const entrances = bundleJavaScriptLast(withStylesheets);

const entry = {};
for (let k in entrances) {
    let key = null;
    let array = k.split('/').map(e => e.replace(RegExp(':', 'ig'), ''));
    array.pop()
    if (k === '/index') key = camelCase('index')
    else key = camelCase(array.join(' '));
    entry[key] = entrances[k];
}

let plugins = [
    new webpack.LoaderOptionsPlugin({
        options: {
            devtools: 'eval-source-map',
        },
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new TimeFixPlugin(),
	new WriteFilePlugin(),
];

if (!noProduction) plugins.splice(3, 1);
if (vueJs) plugins = plugins.concat([new VueLoaderPlugin()]) 

const configuration = {
    name: 'client',
    mode: noProduction ? 'development' : 'production',
    context: context,
    entry: entry,
    output: {
        path: path.resolve(context, 'assets', 'dist', 'pages'),
        filename: '[name].js',
        publicPath: '/',
    },
    target: 'web',
    module: {
        rules: [
            ...jsLoader,
            {
                test: /\.css$/,
                use: [noProduction && !vueJs ? 'style-loader' : vueJs ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.s[ac]ss$/,
                use: [noProduction && !vueJs ? 'style-loader' : vueJs ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.less$/,
                use: [noProduction && !vueJs ? 'style-loader' : vueJs ? 'vue-style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/,
                loader: 'url-loader?name=[name].[ext]&limit=100000',
            },
        ],
    },
    resolve: Object.assign({}, vueJs ? { alias: { 'vue$': 'vue/dist/vue.esm.js' } } : {}, {
        extensions: ['*', '.js', '.jsx', '.ts', '.vue', '.json', '.scss', '.sass', '.css', '.less'],
        moduleExtensions: ['-loader'],
    }),
    plugins: plugins,
};

module.exports = configuration;
