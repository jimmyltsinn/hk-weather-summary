let express = require('express');
let database = require('./database.js');
let app = express();

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
  res.send('Hihi world');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
