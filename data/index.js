const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('../models/User'),
  Photo = require('../models/Photo'),
  Comment = require('../models/Comment');

module.exports = function (connectionString) {
  mongoose.Promise = global.Promise;
  mongoose.connect(connectionString);

  mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });

  const data = {};

  const models = {
    Photo,
    User,
    Comment
  };

  fs.readdirSync('./data')
        .filter(x => x.includes('-data'))
        .forEach((file) => {
          const dataModule =
                require(path.join(__dirname, file))(models);

          Object.keys(dataModule)
                .forEach((key) => {
                  data[key] = dataModule[key];
                });
        });

  return data;
};
