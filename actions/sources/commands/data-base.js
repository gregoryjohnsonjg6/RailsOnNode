const shell = require('shelljs');

const description = 'Use wrapper for the CLIs used for databases';

const documentation = () => {
    console.yellow(`
Command:

Types:
    Database-Types
    -> sql
    -> mongodb

Helps:
    Database-Types
    -> sql --help
    -> mongodb help

node-rails data-base <data-type> <native commands>
    `);
};

const command = (type) => {
    if (!type) {
        console.red('Enter a database type');
        return;
    }

    const dbTypes = {
        sql: './node_modules/sequelize-cli/src/sequelize',
        mongodb: './node_modules/mongoose-model-cli/bin/mongoose-model-cli',
    };

    const strs = [...arguments];
    const str = strs.slice(1).join(' ');

    if (dbTypes[type]) {
        shell.exec(`${dbTypes[type]} ${str}`);
        console.green('Wrapper for database type used.');
    } else {
        documentation();
    }
};

module.exports = {
    command,
    description,
    documentation,
};
