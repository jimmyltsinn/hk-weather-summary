const fields = 'temp_max, temp_mean, temp_min';

const sql_weather_select_all = `SELECT year, month, date, ${fields} FROM weather`;
const sql_weather_select_year = `SELECT year, month, date, ${fields} FROM weather WHERE year = $year`;
const sql_weather_select_month = `SELECT year, month, date, ${fields} FROM weather WHERE year = $year AND month = $month`;
const sql_weather_select_date = `SELECT year, month, date, ${fields} FROM weather WHERE year = $year AND month = $month AND date = $date`;
const sql_weather_select_date_by_year = `SELECT year, month, date, ${fields} FROM weather WHERE month = $month AND date = $date`;

const sql_solar_term_select_year = `SELECT year, month, date, ${fields} FROM solar_term WHERE year = $year`;
const sql_solar_term_select_term = `SELECT year, month, date, ${fields} FROM solar_term WHERE solar_term = $solar_term`;
// const sql_solar_term_select = 'SELECT * FROM solar_term WHERE year = $year AND month = $month AND date = $date AND solar_term = $solar_term';

let get_weather = (db) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_select_all, { }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        if (!ret[row.year]) ret[row.year] = {};
        if (!ret[row.year][row.month]) ret[row.year][row.month] = {};
        ret[row.year][row.month][row.date] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};

let get_weather_date = (db, year, month, date) => {
  return new Promise((resolve, reject) => {
    db.get(sql_weather_select_date, {
      $year: year,
      $month: month,
      $date: date
    }, (err, row) => {
      if (err) reject(err);
      if (!row) resolve(null);
      else {
        delete row.id;
        resolve(row);
      }
    });
  });
};

let get_weather_month = (db, year, month) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_select_month, {
      $year: year,
      $month: month
    }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        ret[row.date] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};

let get_weather_year = (db, year) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_select_year, {
      $year: year,
    }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        if (!ret[row.month]) ret[row.month] = {};
        ret[row.month][row.date] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};

let get_solar_term_term = (db, term) => {
  return new Promise((resolve, reject) => {
    db.all(sql_solar_term_select_term, {
      $solar_term: term
    }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        ret[row.year] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};

let get_solar_term_year = (db, year) => {
  return new Promise((resolve, reject) => {
    db.all(sql_solar_term_select_year, {
      $year: year
    }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        ret[row.solar_term] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};

let database = require('./database.js');

database.get_weather = get_weather;
database.get_weather_date = get_weather_date;
database.get_weather_month = get_weather_month;
database.get_weather_year = get_weather_year;
database.get_solar_term_year = get_solar_term_year;
database.get_solar_term_term = get_solar_term_term;

module.exports = database;
