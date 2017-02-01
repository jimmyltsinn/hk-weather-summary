let express = require('express');
let database = require('./db-util/database-select.js');
let cors = require('cors');

let app = express();

let port = process.env.PORT || 3000;

app.use(cors());

app.get('/weather', (req, res) => {
  database.connect()
    .then(db => database.get_weather(db))
    .then(data => res.json(data))
    .catch(console.error);
});

app.get('/weather/:year/:month/:date', (req, res) => {
  database.connect()
    .then((db) => database.get_weather_date(db, req.params.year, req.params.month, req.params.date))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/weather/:year/:month', (req, res) => {
  database.connect()
    .then((db) => database.get_weather_month(db, req.params.year, req.params.month))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/weather/:year', (req, res) => {
  database.connect()
    .then((db) => database.get_weather_year(db, req.params.year))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/solar-term/year/:year', (req, res) => {
  if (req.params.term < 1901 || req.params.term > 2100) {
    res.status(400);
    res.send('Invalid input for year. ');
  }
  database.connect()
    .then((db) => database.get_solar_term_year(db, req.params.year))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/solar-term/term/:term', (req, res) => {
  if (req.params.term < 1 || req.params.term > 12) {
    res.status(400);
    res.send('Invalid input for solar term. ');
  }
  database.connect()
    .then((db) => database.get_solar_term_term(db, req.params.term))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/', (req, res) => {
  res.send(`HK Weather Summary data is serving on port ${port}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
