let fs = require('fs');
let extract = require('pdf-text-extract');
let download = require('download');

let fetch_data = (db, year) => {
  let download_dir = `tmp`;
  let download_path = `${download_dir}/${year}.pdf`;
  console.log(`Downloading solar term data of ${year} ...`);
  download(`http://www.hko.gov.hk/gts/time/calendar/pdf/${year}.pdf`)
    .then((data) => {
      if (!fs.existsSync(download_dir)) fs.mkdirSync(download_dir);
      fs.writeFileSync(download_path, data);
    }).then(() => process_solar_term_pdf(year, download_path)
    ).then(() => {
      fs.unlinkSync(download_path);
      console.log(`Finish handling solar term data of ${year}`);
    }).catch(console.error);
};

let process_solar_term_pdf = (year, path) => {
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
          // console.log(line);
          // console.log(match);
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
          obj[match[1]] = day;
        }
        // console.log(obj);
        resolve(obj);
    });
  });
};

for (let i = 1901; i <= 2100; ++i) {
  fetch_data(null, i);
}
