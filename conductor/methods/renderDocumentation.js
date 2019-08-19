const { globalRenders, makeHash } = require('./renders');

module.exports = {

    documentationRoutes: ({ apiVersion, allRoutes }) => (req, res) => {
        const data = allRoutes.map(e => ({
            ...e,
            camelCased: `${e.method.toLowerCase()}${apiVersion.toUpperCase()}${e.route.split('/').slice(1).map(el => el[0].toUpperCase() + el.slice(1)).join('').split(':').map((el, id, ar) => id === 0 && ar.length > 1 ? el + 'Param' : ar.length === 1 ? el : el[0].toUpperCase() + el.slice(1)).join('')}`,
            allowParams: e.route.split(':').length > 1,
            params: e.route.split('/').filter(e => e[0] === ':').map(e => e.slice(1)),
            allowBody: e.method === 'GET' ? false : e.method !== 'DELETE',
            routeHeader: e.method === 'GET'
                ? 'bg-success text-white'
                : e.method === 'POST'
                    ? 'bg-info text-white'
                    : e.method === 'PATCH'
                        ? 'bg-warning text-white'
                        : e.method === 'PUT'
                            ? 'bg-warning text-white'
                            : e.method === 'DELETE'
                                ? 'bg-danger text-white' : '',
            submitButtonColor: e.method === 'GET'
                ? 'btn btn-outline-success'
                : e.method === 'POST'
                    ? 'btn btn-outline-info'
                    : e.method === 'PATCH'
                        ? 'btn btn-outline-warning'
                        : e.method === 'PUT'
                            ? 'btn btn-outline-warning'
                            : e.method === 'DELETE'
                                ? 'btn btn-outline-danger' : '',
        }));

        res.status(200).render('utils/docs', globalRenders('utils/docs', req, res, { allRoutes: data, apiVersion: apiVersion.toUpperCase(), hashId: global.hashId || makeHash(40) }));
    }

};
