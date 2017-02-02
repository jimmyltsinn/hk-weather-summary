let express = require('express');
let cors = require('cors');

let database = require('./db-util/database-select.js');
let solarterm = require('./solar-term.js');

let app = express();

let port = process.env.PORT || 3000;

app.use(cors());

app.get('/weather', (req, res) => {
  database.connect()
    .then(db => database.get_weather_all(db))
    .then(data => res.json(data))
    .catch(console.error);
});

app.get('/weather/:year/:month/:date', (req, res) => {
  database.connect()
    .then((db) => database.get_weather(db, req.params.year, req.params.month, req.params.date))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/weather/solar-term/', (req, res) => {
  database.connect()
    .then(db => database.get_weather_bysolarterm_all(db))
    .then(data => res.json(data))
    .catch(console.error);
});

app.get('/weather/solar-term/:term', (req, res) => {
  database.connect()
    .then(db => database.get_weather_bysolarterm(db, req.params.term))
    .then(data => res.json(data))
    .catch(console.error);
});

app.get('/weather/year/:year', (req, res) => {
  database.connect()
    .then(db => database.get_weather_byyear(db, req.params.year))
    .then(data => res.json(data))
    .catch(console.error);
});

app.get('/weather/date/:month/:date', (req, res) => {
  database.connect()
    .then(db => database.get_weather_bydate(db, req.params.month, req.params.date))
    .then(data => res.json(data))
    .catch(console.error);
});

app.get('/solar-term', (req, res) => {
  database.connect()
    .then((db) => database.get_solarterm_all(db))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/solar-term/map', (req, res) => {
  res.json(solarterm.map);
});

app.get('/solar-term/id/:id', (req, res) => {
  res.json(solarterm.get_name(req.params.id));
});

app.get('/solar-term/year/:year', (req, res) => {
  if (req.params.term < 1901 || req.params.term > 2100) {
    res.status(400);
    res.send('Invalid input for year. ');
  }
  database.connect()
    .then((db) => database.get_solarterm_byyear(db, req.params.year))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/solar-term/term/:term', (req, res) => {
  if (req.params.term < 1 || req.params.term > 12) {
    res.status(400);
    res.send('Invalid input for solar term. ');
  }
  database.connect()
    .then((db) => database.get_solarterm_byterm(db, req.params.term))
    .then((data) => res.json(data))
    .catch(console.error);
});

app.get('/', (req, res) => {
  res.send(`HK Weather Summary data is serving on port ${port}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
