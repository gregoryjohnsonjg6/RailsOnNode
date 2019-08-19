const fs = require('fs');
const path = require('path');


module.exports = (settings) => () => {
    const babelrc = JSON.parse(fs.readFileSync(path.join(settings.context, '.babelrc')))
    require('babel-register')(babelrc);
    const { Provider } = require('react-redux');
    const { renderToStaticMarkup } = require('react-dom/server');

    return (Component, store) => renderToStaticMarkup(
        <Provider store={store}>
            <Component />
        </Provider>
    );
};
