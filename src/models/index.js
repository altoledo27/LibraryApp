const dbConfig = require('../config/db.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
// TODO: Add the users when is completed
// db.users = require('./users.js')(mongoose);

module.exports = db;