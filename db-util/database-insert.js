const sql_weather_insert = `INSERT INTO weather ('year', 'month', 'date', 'pressure', 'temp_max', 'temp_mean', 'temp_min', 'dew_point', 'humidity', 'cloud', 'rainfall', 'sunshine', 'wind_dir', 'wind_speed') VALUES ($year, $month, $date, $pressure, $temp_max, $temp_mean, $temp_min, $dew_point, $humidity, $cloud, $rainfall, $sunshine, $wind_dir, $wind_speed)`;
const sql_weather_update = `UPDATE weather SET 'pressure'=$pressure, 'temp_max'=$temp_max, 'temp_mean'=$temp_mean, 'temp_min'=$temp_min, 'dew_point'=$dew_point, 'humidity'=$humidity, 'cloud'=$cloud, 'rainfall'=$rainfall, 'sunshine'=$sunshine, 'wind_dir'=$wind_dir, 'wind_speed'=$wind_speed WHERE 'year'=$year AND 'month'=$month AND 'date'=$date`;
const sql_weather_select_date = 'SELECT * FROM weather WHERE year = $year AND month = $month AND date = $date';

const sql_solar_term_insert = `INSERT INTO solar_term ('year', 'month', 'date', 'solar_term') VALUES ($year, $month, $date, $solar_term)`;
const sql_solar_term_update = `UPDATE solar_term SET 'solar_term'=$solar_term WHERE year = $year AND month = $month AND date = $date`;
const sql_solar_term_select_date = 'SELECT * FROM solar_term WHERE year = $year AND month = $month AND date = $date';

let insert_weather_date = (db, data) => {
  return new Promise((resolve, reject) => {
    let sql_data = {
      $year: data.year,
      $month: data.month,
      $date: data.date,
      $pressure: data.pressure,
      $temp_max: data.temp_max,
      $temp_mean: data.temp_mean,
      $temp_min: data.temp_min,
      $dew_point: data.dew_point,
      $cloud: data.cloud,
      $rainfall: data.rainfall,
      $sunshine: data.sunshine,
      $wind_dir: data.wind_dir,
      $wind_speed: data.wind_speed
    };

    db.get(sql_weather_select_date, {
      $year: data.year,
      $month: data.month,
      $date: data.date
    }, (err, row) => {
      if (err) reject(err);
      db.run(row ? sql_weather_update : sql_weather_insert, sql_data, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
};

let insert_weather_batch = (db, year, objs) => {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (let data of objs) {
      promises.push(insert_weather_date(db, data));
    }
    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
};

let insert_solar_term_date = (db, year, month, date, term) => {
  return new Promise((resolve, reject) => {
    let sql_data = {
      $year: year,
      $month: month,
      $date: date,
      $solar_term: term
    };
    db.get(sql_solar_term_select_date, {
      $year: year,
      $month: month,
      $date: date
    }, (err, row) => {
      if (err) reject(err);
      db.run(row ? sql_solar_term_update : sql_solar_term_insert, sql_data, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
};

let insert_solar_term_batch = (db, year, objs) => {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (let key in objs) {
      promises.push(insert_solar_term_date(db, objs[key].year, objs[key].month, objs[key].date, objs[key].solar_term_id));
    }
    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
};

let database = require('./database.js');

database.insert_weather_batch = insert_weather_batch;
database.insert_weather_date = insert_weather_date;
database.insert_solar_term_batch = insert_solar_term_batch;
database.insert_solar_term_date = insert_solar_term_date;

module.exports = database;
