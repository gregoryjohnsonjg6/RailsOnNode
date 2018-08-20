// place connection string here
// e.g. var uri = 'mongodb://andy:corn@ds051334.mongolab.com:51334/cli';
// or   var uri = 'mongodb://andy:corn@localhost:27017/cli';
// or   var uri = config.get('mongo');
// or   var uri = process.env.MONGO_URL

var url = require('url')

var uri = '';
if (!uri) {
  throw new Error(
    '\033[31mYou need to provide the connection string. ' +
    'You can open "models/connection-string.js" and export it or use the "setUri" command.\033[0m'
  );
}

var uriObj = url.parse(uri)
if (uriObj.protocol !== 'mongodb:') {
  throw new Error('Must be a mongodb URI')
}
if (!uriObj.host || !uriObj.path) {
  throw new Error('Improperly formatted URI')
}

module.exports = uri;

