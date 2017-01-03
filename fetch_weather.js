var sqlite3 = require('sqlite3').verbose();
var request = require('request');

let sql_init = `CREATE TABLE IF NOT EXISTS 'weather' (
	'id'	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	'year'	INTEGER NOT NULL,
	'month'	INTEGER NOT NULL,
	'date'	INTEGER NOT NULL,
	'pressure'	INTEGER,
	'temp_max'	REAL,
	'temp_mean'	REAL,
	'temp_min'	REAL,
	'dew_point'	REAL,
	'humidity'	INTEGER,
	'cloud'	INTEGER,
	'rainfall'	REAL,
	'sunshine'	REAL,
	'wind_dir'	INTEGER,
	'wind_speed'	REAL
);`;

var insert_data = (year, month, date, data) => {
  db.get('SELECT * FROM weather WHERE year = $year AND month = $month AND date = $date', {
      $year: year,
      $month: month,
      $date: date
    }, (err, row) => {
      var sql_cmd;

      if (!row) {
        console.log(`Insert for ${year} / ${month} / ${date}`);
        sql_cmd = `INSERT INTO weather
          ('year', 'month', 'date', 'pressure', 'temp_max', 'temp_mean', 'temp_min', 'dew_point', 'humidity', 'cloud', 'rainfall', 'sunshine', 'wind_dir', 'wind_speed')
          VALUES (${year}, ${month}, ${date}, ${data.pressure}, ${data.temp_max}, ${data.temp_mean}, ${data.temp_min}, ${data.dew_point}, ${data.humidity}, ${data.cloud}, ${data.rainfall}, ${data.sunshine}, ${data.wind_dir}, ${data.wind_speed})`;
      } else {
        console.log(`Update for ${year} / ${month} / ${date}`);
        sql_cmd = `UPDATE weather
          SET
            'pressure'=${data.pressure},
            'temp_max'=${data.temp_max},
            'temp_mean'=${data.temp_mean},
            'temp_min'=${data.temp_min},
            'dew_point'=${data.dew_point},
            'humidity'=${data.humidity},
            'cloud'=${data.cloud},
            'rainfall'=${data.rainfall},
            'sunshine'=${data.sunshine},
            'wind_dir'=${data.wind_dir},
            'wind_speed'=${data.wind_speed}
          WHERE
            'year'=${year} AND
            'month'=${month} AND
            'date'=${date}`;
      }
      db.run(sql_cmd, (err) => {
        if (err) console.log(err);
      });
    });
}

var fetch_data = (db, year) => {
    console.log(`Fetching weather data of ${year} ...`);
    request(`http://www.hko.gov.hk/cis/dailyExtract/dailyExtract_${year}.xml`, (err, res, body) => {
        if (err) {
            console.log('Error in downloading data from HKO. ' + err);
        }
        var data = JSON.parse(body).stn.data;
        for (var i in data) {
          var month = parseInt(data[i].month);
          for (var j in data[i].dayData) {
            var date = parseInt(data[i].dayData[j][0]);
            if (isNaN(date)) continue;
            var row = data[i].dayData[j];
            var obj = {};
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

            insert_data(year, month, date, obj);
          }
        }
    });
};

var db = new sqlite3.Database('data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.log('Failed in opening database! ' + err);
    } else {
        console.log('Database connection started! ');
        db.run(sql_init, [], (err) => {
            if (err) console.log('Database intialize error! ' + err);
        });
        for (var i = 1886; i <= 2016; ++i) {
            fetch_data(db, i);
        }
    }
});



// db.close((err) => {
//     if (err) {
//         console.log('Error!' + err);
//     } else {
//         console.log('Database connection closed! ');
//     }
// });


// db.run(sql_init)
// var fetch_data = () ->
