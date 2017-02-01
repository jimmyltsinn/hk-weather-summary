let database = require('./db-util/database.js');
let fetch_weather = require('./setup/fetch_weather.js');
let fetch_solar_term = require('./setup/fetch_solar-term.js');

database.connect()
  .then((db) => fetch_weather(db, [1886, 2016]))
  .then((db) => fetch_solar_term(db, [1901, 2100]))
  .catch(console.error);
