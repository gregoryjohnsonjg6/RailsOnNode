const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const description = 'Change javascript frameworks or style types';

const command = (type, options) => {
    if (!type || !options) {
        console.red(`Please select a type of asset to change`);
        return;
    }

    if (type === 'bootstrap') {
        options.swtich = 
    }

    const TYPING = {
        'javascripts': {
            'react': 'jsx',
            'angular': 'ts',
            'vue': 'vue',
            'js': 'js',
        },
        'stylesheets': {
            'less': 'less',
            'sass': 'scss',
            'css': 'css',
        },
    };

    const root = process.cwd();

    const jsStrings = {
        'react': (pathNames) => {
            const pathn = path.join(__dirname, '..', '..', '..', 'templates', 'assets', 'page.jsx');
            const str = fs.readFileSync(pathn, { encoding: 'utf8' });

            // replacements
            const regexStyles = new RegExp('/route-path'); // for styles
            const regexRedux = new RegExp('/* CLI: Redux */'); // for redux
            const regexJs = new RegExp('/* CLI: Route Path */'); // for javascripts
            const regexJsPathnames = new RegExp('/js/', 'ig'); // for javascript regex

            const regexJsString = pathNames;
            const regexReduxString = `{}`;
            const routeCss = pathNames.split('/').reduce((acc, item) => {
                let bool = false
                if (item === 'assets') {
                    bool = true;
                } else if (bool) {
                    acc.push(item);
                }
                return acc;
            }, []).slice(4).map(e => {
                return '..'
            }).concat(pathNames.split('/')).reduce((acc, item) => {
                let bool = false
                if (item === 'assets') {
                    bool = true;
                } else if (bool) {
                    acc.push(item);
                }
                return acc;
            }, []).slice(4).map((e, i, a) => {
                if (i === a.length - 1) {
                    const filen = e.split('.');
                    const filename = filen[0] + `.${settings.styleType}`;
                    return filename;
                } else if (i === 0) {
                    return settings.styleType;
                } else {
                    return e;
                }
            }).join('/');

            const regexStylesString = pathNames.replace(regexJsPathnames, routeCss);

            fs.writeFileSync(pathn, str.replace(regexRedux, regexReduxString).replace(regexJs, regexJsString).replace(regexStyles, regexStylesString));
        },
        'angular': (pathNames) => {
            const pathn = path.join(__dirname, '..', '..', '..', 'templates', 'assets', 'page.ts');
            const str = fs.readFileSync(pathn, { encoding: 'utf8' });

            const root = process.cwd();
            const settings = require(path.join(root, 'webpack', 'settings.js'));

            // replacements
            const regexStyles = new RegExp('/route-path'); // for styles
            const regexRedux = new RegExp('/* CLI: Redux */'); // for redux
            const regexJs = new RegExp('/* CLI: Route Path */'); // for javascripts
            const regexJsPathnames = new RegExp(`/${settings.jsType}/`, 'ig'); // for javascript regex

            const routeCss = pathNames.split('/').reduce((acc, item) => {
                let bool = false
                if (item === 'assets') {
                    bool = true;
                } else if (bool) {
                    acc.push(item);
                }
                return acc;
            }, []).slice(4).map(e => {
                return '..'
            }).concat(pathNames.split('/')).reduce((acc, item) => {
                let bool = false
                if (item === 'assets') {
                    bool = true;
                } else if (bool) {
                    acc.push(item);
                }
                return acc;
            }, []).slice(4).map((e, i, a) => {
                if (i === a.length - 1) {
                    const filen = e.split('.');
                    const filename = filen[0] + `.${settings.styleType}`;
                    return filename;
                } else if (i === 0) {
                    return settings.styleType;
                } else {
                    return e;
                }
            }).join('/');

            const regexJsString = pathNames;
            const regexReduxString = `{}`;
            const regexStylesString = pathNames.replace(regexJsPathnames, routeCss);

            fs.writeFileSync(pathn, str.replace(regexRedux, regexReduxString).replace(regexJs, regexJsString).replace(regexStyles, regexStylesString));
        },
        'vue': (pathNames) => {
            const pathn = path.join(__dirname, '..', '..', '..', 'templates', 'assets', 'page.vue');
            const str = fs.readFileSync(pathn, { encoding: 'utf8' });

            const routeCss = pathNames.split('/').reduce((acc, item) => {
                let bool = false
                if (item === 'assets') {
                    bool = true;
                } else if (bool) {
                    acc.push(item);
                }
                return acc;
            }, []).slice(4).map(e => {
                return '..'
            }).concat(pathNames.split('/')).reduce((acc, item) => {
                let bool = false
                if (item === 'assets') {
                    bool = true;
                } else if (bool) {
                    acc.push(item);
                }
                return acc;
            }, []).slice(4).map((e, i, a) => {
                if (i === a.length - 1) {
                    const filen = e.split('.');
                    const filename = filen[0] + `.${settings.styleType}`;
                    return filename;
                } else if (i === 0) {
                    return settings.styleType;
                } else {
                    return e;
                }
            }).join('/');

            const regexJsString = pathNames;
            const regexReduxString = `{}`;
            const regexJsPathnames = new RegExp('/js/', 'ig'); // for javascript regex
            const regexStylesString = pathNames.replace(regexJsPathnames, routeCss);

            // replacements
            const regexStyles = new RegExp('/route-path'); // for styles
            const regexRedux = new RegExp('/* CLI: Redux */'); // for redux
            const regexJs = new RegExp('/* CLI: Route Path */'); // for javascripts

            fs.writeFileSync(pathn, str.replace(regexRedux, regexReduxString).replace(regexJs, regexJsString).replace(regexStyles, regexStylesString));
        },
    };

    const jsWebpack = {
        'react': {
            'test': '.jsx$',
            'exclude': 'node_modules',
            'use': ['babel-loader'],
        },
        'angular': {
            'test': '.ts$',
            'exclude': 'node_modules',
            'use': ['babel-loader'],
        },
        'vue': {
            'test': '.vue$',
            'exclude': '(node_modules|bower_components)',
            'use': ['vue-loader'],
            'query': {
                'presets': ['es2015', 'stage-2'],
                'plugins': ['transform-runtime'],
                'comments': false,
            },
        },
        'js': {
            'test': '.js$',
            'exclude': 'node_modules',
            'use': ['babel-loader'],
        },
    };

    const reverseJs = Object.values(TYPING.javascripts).reduce((acc, item) => {
        acc[item] = item;
        return acc;
    }, {});

    const reverseCss = Object.values(TYPING.stylesheets).reduce((acc, item) => {
        acc[item] = item;
        return acc;
    }, {});

    const trail = fs.readdirSync(path.join(root, 'assets')).reduce((acc, item) => {
        if (reverseCss[item] && TYPING.stylesheets[type]) {
            acc.push(item);
            acc.push(TYPING.stylesheets[type]);
        }
        if (reverseJs[item] && TYPING.javascripts[type]) {
            acc.push(item);
            acc.push(TYPING.javascripts[type]);
        }
        return acc;
    }, []);

    const before = trail[0];
    const after = trail[1];

    // styles change file path types
    // javascript change full root files
    const arrayOfPaths = (data, pathn) => {
        fs.readdirSync(pathn).forEach(dir => {
            if (fs.lstatSync(path.join(pathn, dir)).isDirectory()) {
                const temp = data;
                arrayOfPaths(temp, path.join(pathn, dir));
            } else {
                data.push(path.join(pathn, dir));
            }
        });

        return data;
    };

    const beforeTypes = arrayOfPaths([], path.join(root, 'assets', before, 'pages'));

    beforeTypes.forEach(dir => {
        const fileArray = dir.split('/');
        const filename = fileArray[fileArray.length - 1].split('.')[0] + '.' + after;
        const newFile = fileArray.slice(0, fileArray.length - 1).join('/') + '/' + filename;

        if (TYPING.javascripts[type] === after) {
            shell.mv(dir, newFile);
            shell.cp(path.join(__dirname, '..', '..', '..', 'templates', 'assets', `page.${after}`), newFile);
            jsStrings[type](newFile);
        } else if (TYPING.stylesheets[type] === after) {
            shell.mv(dir, newFile);
        }
    });

    shell.mv(path.join(root, 'assets', before), path.join(root, 'assets', after));

    // Handle webpack here
    const pathn = path.join(root, 'webpack', 'settings.js');
    const javascriptSettings = require(pathn);

    if (TYPING.javascripts[before]) {
        javascriptSettings.jsType = after;
        javascriptSettings.javascriptSettings = jsWebpack[type];
    } else if (TYPING.stylesheets[before]) {
        javascriptSettings.styleType = after;
    }

    fs.writeFileSync(pathn, `module.exports = ${JSON.stringify(javascriptSettings, null, 4)}`);

    console.green(`Your settings have been changed from ${before} to ${after}`);
};

const documentation = () => {
    console.yellow(`
Commands:
    stylesheets
    -> css
    -> less
    -> sass

    javascripts
    -> js
    -> react
    -> angular
    -> vue

Command:
neutron settings <command-name> [Options]
    `);
};

module.exports = {
    command,
    description,
    documentation,
};
