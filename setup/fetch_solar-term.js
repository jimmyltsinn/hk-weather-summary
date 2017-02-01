let fs = require('fs');
let extract = require('pdf-text-extract');
let download = require('download');
let solar_term = require('../solar-term.js');
let unorm = require('unorm');
let database = require('../db-util/database.js');

let download_solar_term_data = (year) => {
  console.log(`[solarterm-${year}] Download`);
  return download(`http://www.hko.gov.hk/gts/time/calendar/pdf/${year}.pdf`);
};

let parse_solar_term_pdf = (year, path) => {
  return new Promise((resolve, reject) => {
    extract(path, (err, pages) => {
        if (err) reject(err);

        let text = pages[0];
        let lines = text.split('\n');

        let re_month = /^[ ]*([0-9]+)/;
        let re_solar_term = /([^ ]{2})[：|:] ([0-9]+)[ ]{0,1}日/;

        let obj = {};
        for (let i = 0; i < lines.length; ++i) {
          let line = lines[i];
          let match = re_solar_term.exec(line);
          if (!match) continue;
          let day = {
            year: year,
            month: parseInt(re_month.exec(line) || null),
            date: parseInt(match[2])
          };
          let j = 1;
          while (!day.month) {
            day.month = parseInt(re_month.exec(lines[i - j]) || null);
            ++j;
            if (j > i) break;
          }
          obj[unorm.nfd(match[1])] = day;
          day.solar_term_id = solar_term.get_id(match[1]);
        }
        // console.log(obj);
        // let tmp = {};
        // for (let key in obj) {
        //   if (!obj.hasOwnProperty(key)) continue;
        //   tmp[solar_term.get_id(key)] = 1;
        // }
        // for (let j = 1; j <= 24; ++j) if (tmp[j] != 1) throw -1;
        resolve(obj);
    });
  });
};

let fetch_solar_term = (db, year_range) => {
  return new Promise((resolve, reject) => {
    let download_dir = `tmp`;
    if (!fs.existsSync(download_dir)) fs.mkdirSync(download_dir);

    let promises = [];
    for (let i = year_range[0]; i <= year_range[1]; ++i) {
      let download_path = `${download_dir}/${i}.pdf`;
      promises.push(
        download_solar_term_data(i)
          .then((data) => fs.writeFileSync(download_path, data))
          .then(() => parse_solar_term_pdf(i, download_path))
          .then((data) => database.insert_solar_term_batch(db, i, data))
          .then(() => {
            console.log(`[solarterm-${i}] Done`);
            fs.unlinkSync(download_path);
          })
      );
    }
    Promise.all(promises)
      .then(() => resolve(db))
      .catch(reject);
  });
};

// export default fetch_solar_term;
module.exports = fetch_solar_term;
