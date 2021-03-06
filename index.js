const express = require('express');
const winston = require('winston');
const app = express();

// load logging first in case an error during startup process occurs
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

if(process.env.NODE_ENV = 'production')
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;