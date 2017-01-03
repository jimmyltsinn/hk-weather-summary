var fs = require('fs');
var extract = require('pdf-text-extract');
var download = require('download');

var fetch_data = (db, year) => {
  var download_dir = `tmp`;
  var download_path = `${download_dir}/${year}.pdf`;
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

var process_solar_term_pdf = (year, path) => {
  return new Promise((fulfill, reject) => {
    extract(path, (err, pages) => {
        if (err) reject(err);

        var text = pages[0];
        var lines = text.split('\n');

        var re_month = /^[ ]*([0-9]+)/;
        var re_solar_term = /([^ ]{2})[：|:] ([0-9]+)[ ]{0,1}日/;

        var obj = {};
        for (var i = 0; i < lines.length; ++i) {
          var line = lines[i];
          var match = re_solar_term.exec(line);
          // console.log(line);
          // console.log(match);
          if (!match) continue;
          var day = {
            year: year,
            month: parseInt(re_month.exec(line) || null),
            date: parseInt(match[2])
          };
          var j = 1;
          while (!day.month) {
            day.month = parseInt(re_month.exec(lines[i - j]) || null);
            ++j;
            if (j > i) break;
          }
          obj[match[1]] = day;
        }
        // console.log(obj);
        fulfill(obj);
    });
  });
};

for (var i = 1901; i <= 2100; ++i) {
  fetch_data(null, i);
}
