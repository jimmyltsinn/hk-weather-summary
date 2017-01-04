let request = require('request');
let database = require('./database.js');

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

let fetch_weather = (db, year_range) => {
  return new Promise((resolve, reject) => {
    let promises = [];
    for (let i = year_range[0]; i <= year_range[1]; ++i) {
        promises.push(
          download_weather_data(i)
            .then(data => parse_weather_data(data, i))
            .then(data => database.insert_weather_batch(db, i, data))
            .catch(console.error)
          );
    }
    Promise.all(promises)
      .then(resolve)
      .catch(reject);
  });
};

database.connect()
  .then((db) => fetch_weather(db, [1886, 2016]))
  .catch(console.error);
