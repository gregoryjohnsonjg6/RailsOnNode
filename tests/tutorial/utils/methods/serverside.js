const path = require('path');
const settings = require('../../webpack/settings');

module.exports = {

    serverSide: (pageName, req) => {
        const assets = path.join(__dirname, '..', '..', 'assets', settings.jsType, 'storage', 'store');
        const store = require(assets);
        req.session.redux = store(req.session.storage || {});

        return {
            serversideStorage: JSON.stringify(req.session.storage),
        };
    },

    getFreshStore: (req) => {
        const assets = path.join(__dirname, '..', '..', 'assets', settings.jsType);
        const store = require(path.join(assets, 'storage', 'store'))(req.session.storage || {});
        return store.getState();
    },

};
