let sqlite3 = require('sqlite3').verbose();

const default_db_path = 'data.db';

const sql_weather_init = `CREATE TABLE IF NOT EXISTS 'weather' ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 'year' INTEGER NOT NULL, 'month' INTEGER NOT NULL, 'date' INTEGER NOT NULL, 'pressure' INTEGER, 'temp_max' REAL, 'temp_mean' REAL, 'temp_min' REAL, 'dew_point' REAL, 'humidity' INTEGER, 'cloud' INTEGER, 'rainfall' REAL, 'sunshine' REAL, 'wind_dir' INTEGER, 'wind_speed' REAL);`;
const sql_weather_select_year = 'SELECT * FROM weather WHERE year = $year';
const sql_weather_select_month = 'SELECT * FROM weather WHERE year = $year AND month = $month';
const sql_weather_select_date = 'SELECT * FROM weather WHERE year = $year AND month = $month AND date = $date';
const sql_weather_insert = `INSERT INTO weather ('year', 'month', 'date', 'pressure', 'temp_max', 'temp_mean', 'temp_min', 'dew_point', 'humidity', 'cloud', 'rainfall', 'sunshine', 'wind_dir', 'wind_speed') VALUES ($year, $month, $date, $pressure, $temp_max, $temp_mean, $temp_min, $dew_point, $humidity, $cloud, $rainfall, $sunshine, $wind_dir, $wind_speed)`;
const sql_weather_update = `UPDATE weather SET 'pressure'=$pressure, 'temp_max'=$temp_max, 'temp_mean'=$temp_mean, 'temp_min'=$temp_min, 'dew_point'=$dew_point, 'humidity'=$humidity, 'cloud'=$cloud, 'rainfall'=$rainfall, 'sunshine'=$sunshine, 'wind_dir'=$wind_dir, 'wind_speed'=$wind_speed WHERE 'year'=$year AND 'month'=$month AND 'date'=$date`;

const sql_solar_term_init = `CREATE TABLE IF NOT EXISTS 'solar_term' ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 'year' INTEGER NOT NULL, 'month' INTEGER NOT NULL, 'date' INTEGER NOT NULL, 'solar_term' INTEGER NOT NULL);`;
const sql_solar_term_insert = `INSERT INTO solar_term ('year', 'month', 'date', 'solar_term') VALUES ($year, $month, $date, $solar_term)`;
const sql_solar_term_select_year = 'SELECT * FROM solar_term WHERE year = $year';
const sql_solar_term_select_term = 'SELECT * FROM solar_term WHERE solar_term = $solar_term';
const sql_solar_term_select_date = 'SELECT * FROM solar_term WHERE year = $year AND month = $month AND date = $date';
// const sql_solar_term_select = 'SELECT * FROM solar_term WHERE year = $year AND month = $month AND date = $date AND solar_term = $solar_term';
const sql_solar_term_update = `UPDATE solar_term SET 'solar_term'=$solar_term WHERE year = $year AND month = $month AND date = $date`;

let run_sql = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.run(sql, [], (err) => {
      if (err) reject(err);
      resolve(db);
    });
  });
};

let create_weather_table = (db) => run_sql(db, sql_weather_init);
let create_solar_term_table = (db) => run_sql(db, sql_solar_term_init);

let connect = (path) => {
  if (!path) path = default_db_path;
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) reject(err);
        resolve(db);
    });
  });
};

let init = (path) => {
  return connect(path)
    .then(create_weather_table)
    .then(create_solar_term_table)
    .catch(console.error);
};

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

      db.run(row ? sql_weather_insert : sql_weather_update, sql_data, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
};

let insert_weather_batch = (db, year, objs) => {
  return new Promise((resolve, reject) => {
    console.log(`Inserting data for ${year}`);
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

module.exports = {
  connect: init,
  insert_weather_batch: insert_weather_batch,
  insert_weather_date: insert_weather_date,
  get_weather_date: get_weather_date,
  get_weather_month: get_weather_month,
  get_weather_year: get_weather_year,
  insert_solar_term_batch: insert_solar_term_batch,
  insert_solar_term_date: insert_solar_term_date,
  get_solar_term_year: get_solar_term_year,
  get_solar_term_term: get_solar_term_term
};
