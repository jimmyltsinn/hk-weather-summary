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

app.get('/solar-term/:term'), (req, res) => {
  
}

app.get('/', (req, res) => {
  res.send('Hihi world');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
