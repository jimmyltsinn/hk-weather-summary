let sqlite3 = require('sqlite3').verbose();

const default_db_path = 'data.db';

const sql_weather_init = `CREATE TABLE IF NOT EXISTS 'weather' ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 'year' INTEGER NOT NULL, 'month' INTEGER NOT NULL, 'date' INTEGER NOT NULL, 'pressure' INTEGER, 'temp_max' REAL, 'temp_mean' REAL, 'temp_min' REAL, 'dew_point' REAL, 'humidity' INTEGER, 'cloud' INTEGER, 'rainfall' REAL, 'sunshine' REAL, 'wind_dir' INTEGER, 'wind_speed' REAL);`;
const sql_solar_term_init = `CREATE TABLE IF NOT EXISTS 'solar_term' ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 'year' INTEGER NOT NULL, 'month' INTEGER NOT NULL, 'date' INTEGER NOT NULL, 'solar_term' INTEGER NOT NULL);`;

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

module.exports = {
  connect: init,
  run_sql: run_sql
};
