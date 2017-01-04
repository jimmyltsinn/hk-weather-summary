let sqlite3 = require('sqlite3').verbose();
let request = require('request');

const sql_init = `CREATE TABLE IF NOT EXISTS 'weather' ( 'id' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 'year' INTEGER NOT NULL, 'month' INTEGER NOT NULL, 'date' INTEGER NOT NULL, 'pressure' INTEGER, 'temp_max' REAL, 'temp_mean' REAL, 'temp_min' REAL, 'dew_point' REAL, 'humidity' INTEGER, 'cloud' INTEGER, 'rainfall' REAL, 'sunshine' REAL, 'wind_dir' INTEGER, 'wind_speed' REAL);`;
const sql_select = 'SELECT * FROM weather WHERE year = $year AND month = $month AND date = $date';
const sql_insert = `INSERT INTO weather ('year', 'month', 'date', 'pressure', 'temp_max', 'temp_mean', 'temp_min', 'dew_point', 'humidity', 'cloud', 'rainfall', 'sunshine', 'wind_dir', 'wind_speed') VALUES ($year, $month, $date, $pressure, $temp_max, $temp_mean, $temp_min, $dew_point, $humidity, $cloud, $rainfall, $sunshine, $wind_dir, $wind_speed)`;
const sql_update = `UPDATE weather SET 'pressure'=$pressure, 'temp_max'=$temp_max, 'temp_mean'=$temp_mean, 'temp_min'=$temp_min, 'dew_point'=$dew_point, 'humidity'=$humidity, 'cloud'=$cloud, 'rainfall'=$rainfall, 'sunshine'=$sunshine, 'wind_dir'=$wind_dir, 'wind_speed'=$wind_speed WHERE 'year'=$year AND 'month'=$month AND 'date'=$date`;

let insert_weather_data_date = (db, data) => {
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

    db.get(sql_select, {
      $year: data.year,
      $month: data.month,
      $date: data.date
    }, (err, row) => {
      if (err) {
        reject(err);
      }
      let sql_cmd;

      if (!row) {
        // console.log(`Insert for ${data.year} / ${data.month} / ${data.date}`);
        sql_cmd = sql_insert;
      } else {
        // console.log(`Update for ${data.year} / ${data.month} / ${data.date}`);
        sql_cmd = sql_update;
      }
      db.run(sql_cmd, sql_data, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
};

let insert_weather_data = (db, year, objs) => {
  return new Promise((resolve, reject) => {
    console.log(`Inserting data for ${year}`);
    let promises = [];
    for (let data of objs) {
      promises.push(insert_weather_data_date(db, data));
    }
    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
};

let download_weather_data = (year) => {
  return new Promise((resolve, reject) => {
    request(`http://www.hko.gov.hk/cis/dailyExtract/dailyExtract_${year}.xml`, (err, res, body) => {
      if (err) reject(err);
      try {
        resolve(JSON.parse(body).stn.data);
      } catch (err) {
        reject(err);
      }
    });
  });
};

let parse_weather_data = (data, year) => {
  return new Promise((resolve) => {
    let ret = [];
    for (let i in data) {
      let month = parseInt(data[i].month);
      for (let j in data[i].dayData) {
        let date = parseInt(data[i].dayData[j][0]);
        if (isNaN(date)) continue;
        let row = data[i].dayData[j];
        let obj = {};
        obj.year = year;
        obj.month = month;
        obj.date = date;
        obj.pressure = parseFloat(row[1]) || 'NULL';
        obj.temp_max = parseFloat(row[2]) || 'NULL';
        obj.temp_mean = parseFloat(row[3]) || 'NULL';
        obj.temp_min = parseFloat(row[4]) || 'NULL';
        obj.dew_point = parseFloat(row[5]) || 'NULL';
        obj.humidity = parseInt(row[6]) || 'NULL';
        obj.cloud = parseInt(row[7]) || 'NULL';
        obj.rainfall = parseFloat(row[8]) || 'NULL';
        obj.sunshine = parseFloat(row[9]) || 'NULL';
        obj.wind_dir = parseInt(row[10]) || 'NULL';
        obj.wind_speed = parseFloat(row[11]) || 'NULL';

        ret.push(obj);
      }
    }
    // console.log(ret);
    resolve(ret);
  });
};

let connect_database = (path) => {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) reject(err);
        // console.log('Database connection established! ');
        db.run(sql_init, [], (err) => {
            if (err) console.log('Database intialize error! ' + err);
        });
        resolve(db);
    });
  });
};

let fetch_weather = (db, year_range) => {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (let i = year_range[0]; i <= year_range[1]; ++i) {
        promises.push(
          download_weather_data(i)
            .then(data => parse_weather_data(data, i))
            .then(data => insert_weather_data(db, i, data))
            .catch(console.error)
          );
    }
    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
};

connect_database('data.db')
  .then((db) => fetch_weather(db, [1886, 2016]));
