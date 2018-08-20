
const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const router_cata = require('./routes/catagories');
const router_home = require('./routes/homepage');
const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use(express.json()); //Needed to process incoming JSON(application/json) messages.
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/catagories',router_cata);
app.use('/homepage',router_home);

//Configuration
console.log("Application Name: " + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if(app.get('env')==='develop'){
    app.use(morgan('tiny'));
    debug('Morgan enabled');
}

app.use(logger);
app.use(authenticator);

//app setup to listen to correct port.
const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}`));
