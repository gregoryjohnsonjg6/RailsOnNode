require('dotenv').config();
const Express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const favicon = require('serve-favicon');
const csrf = require('csurf');
const parser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);
const {
    documentation,
    updateDocs,
} = require('./utils');
const { docs } = require('./controllers');
const routeVersions = require('./routes');
const { each } = require('lodash');
const meta = require('./app.json');

const protection = csrf();
const app = new Express();

app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', Express.static(path.join(__dirname, 'assets')));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression({ level: 7 }));
app.use(session({
    secret: fs.readFileSync(path.join(__dirname, 'openssl', 'web-secret.pem'), { encoding: 'utf8' }),
    store: new RedisStore({ client: client, disableTTL: true }),
    saveUninitialized: true,
    resave: false,
    name: meta.title,
    cookie: {
        token: null,
    },
}));

if (!process.env.TESTING) {
    app.use(protection);
    app.use((req, res, next) => {
        req.session.cookie.token = req.csrfToken();
        res.locals.csrfToken = req.csrfToken();
        next();
    });
}

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(parser.raw());
app.use(favicon(path.join(__dirname, 'assets', 'img', 'nodejs.png')));

each(routeVersions, (versionDetails, apiVersion) => {
    const allRoutes = versionDetails[apiVersion];
    if (process.env.NODE_ENV !== 'production') documentation({ allRoutes, apiVersion });
    if (process.env.NODE_ENV !== 'production') updateDocs(apiVersion);
    if (process.env.NODE_ENV !== 'production') app.get(`/docs/${apiVersion}`, docs({ apiVersion, allRoutes }));
    app.use(`/api/${apiVersion}`, versionDetails[`${apiVersion}Router`]);
});

app.get('/', (req, res) => { res.status(200).json({ hello: 'world' }); });
// Leave Here For Static Routes

app.use('*', (req, res) => { res.status(404).json({ error: 'Not Found' }); });

app.use((error, req, res, next) => {
    if (error) {
        res.status(500).json({ error });
    }
    next();
});

module.exports = app;
