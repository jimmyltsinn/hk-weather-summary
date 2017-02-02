const fields = 'temp_max, temp_mean, temp_min';

const sql_weather_select_all = `SELECT year, month, date, ${fields} FROM weather`;
let get_weather_all = (db) => {
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

const sql_weather_select = `SELECT year, month, date, ${fields} FROM weather WHERE year = $year AND month = $month AND date = $date`;
let get_weather = (db, year, month, date) => {
  return new Promise((resolve, reject) => {
    db.get(sql_weather_select, {
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

const sql_weather_select_bydate = `SELECT year, month, date, ${fields} FROM weather WHERE month = $month AND date = $date`;
let get_weather_bydate = (db, month, date) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_select_bydate, {
      $month: month,
      $date: date
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

const sql_weather_select_byyear = `SELECT year, month, date, ${fields} FROM weather WHERE year = $year`;
let get_weather_byyear = (db, year) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_select_byyear, {
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

const sql_weather_bysolarterm_all = `SELECT weather.year, weather.month, weather.date, solar_term.solar_term, ${fields} FROM weather INNER JOIN solar_term ON weather.year = solar_term.year AND weather.month = solar_term.month AND weather.date = solar_term.date`;
let get_weather_bysolarterm_all = (db) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_bysolarterm_all, { }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        if (!ret[row.solar_term]) ret[row.solar_term] = {};
        ret[row.solar_term][row.year] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};

const sql_weather_bysolarterm = `SELECT weather.year, weather.month, weather.date, ${fields} FROM weather INNER JOIN solar_term ON weather.year = solar_term.year AND weather.month = solar_term.month AND weather.date = solar_term.date WHERE solar_term.solar_term = $term`;
let get_weather_bysolarterm = (db, term) => {
  return new Promise((resolve, reject) => {
    db.all(sql_weather_bysolarterm, {
      $term: term
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

const sql_solarterm_select_all = `SELECT year, month, date, solar_term FROM solar_term`;
let get_solarterm_all = (db) => {
  return new Promise((resolve, reject) => {
    db.all(sql_solarterm_select_all, { }, (err, rows) => {
      if (err) reject(err);
      let ret = {};
      for (let row of rows) {
        if (!ret[row.solar_term]) ret[row.solar_term] = {};
        ret[row.solar_term][row.year] = row;
        delete row.id;
      }
      resolve(ret);
    });
  });
};


const sql_solarterm_select_byterm = `SELECT year, month, date, solar_term FROM solar_term WHERE solar_term = $solar_term`;
let get_solarterm_byterm = (db, term) => {
  return new Promise((resolve, reject) => {
    db.all(sql_solarterm_select_byterm, {
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

const sql_solarterm_select_byyear = `SELECT year, month, date, solar_term FROM solar_term WHERE year = $year`;
let get_solarterm_byyear = (db, year) => {
  return new Promise((resolve, reject) => {
    db.all(sql_solarterm_select_byyear, {
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

database.get_weather_all = get_weather_all;
database.get_weather = get_weather;

database.get_weather_bydate = get_weather_bydate;
database.get_weather_byyear = get_weather_byyear;

database.get_weather_bysolarterm_all = get_weather_bysolarterm_all;
database.get_weather_bysolarterm = get_weather_bysolarterm;

database.get_solarterm_all = get_solarterm_all;
database.get_solarterm_byyear = get_solarterm_byyear;
database.get_solarterm_byterm = get_solarterm_byterm;

module.exports = database;
