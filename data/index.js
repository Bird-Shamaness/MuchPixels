const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports = function (connectionString) {
  mongoose.Promise = global.Promise;
  mongoose.connect(connectionString);

  const Superhero = require('../models/superhero-model');
  const models = {
      Superhero
    };
  const data = {};

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
