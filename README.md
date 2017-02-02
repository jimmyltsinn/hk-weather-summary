# Hong Kong Weather Summary
**Disclaimer:**
*Data of this project are retrieved from Hong Kong Observatory. We do not store or host any data on either github or other hosts. It is the user to be responsible for the copyright issues when using, extending or redistributing this project.*

HKO has archived the meteorological observations from 1884, which can be found in [here](http://www.hko.gov.hk/cis/climat_e.htm). To facilitate further analysis and investigation with those data, this project pull the data from HKO website, structure the data, store those into a local database, and provide a server to easily retrieve the meteorological observation with a HTTP request.

This project also extract the solar term (節氣) of every year from the PDF files provided by HKO, and structure the data so that you can easily retrieve the date of solar term in a specific year, as well as the date of a specific solar term across years, from 1901 to 2100.

## Requirement
1. This project uses `pdf-text-extract` in processing solar term data from Hong Kong Observatory. Before you run the `setup.js` (and `setup/fetch_solar-term.js`), make sure you have `pdftotext` in your path.

  On macOS, `pdftotext` is included in `poppler`. You can install it with homebrew
  ```bash
brew install poppler
```
  On Ubuntu, it is included in `poppler-utils`:
  ``` bash
sudo apt-get install poppler-utils
```
Check [here](https://github.com/nisaacson/pdf-extract) for other operating system.

## Getting Started
1. Install the dependencies with `yarn install`.
2. Fetch the weather data and solar term data from Hong Kong Observatory.
  ```
node setup.js
```
3. Start the web server with either
  ```
node app.js
```
  or
  ```
yarn start
```

## API
* `GET /weather`: Get all weather data in database
* `GET /weather/year/[year]`: Get weather data of a given year
* `GET /weather/date/[month]/[date]`: Get weather data of a given date across years
* `GET /solar-term/map`: Get the mapping of solar term id and actual name of solar term
* `GET /solar-term/id/[solar-term-id]`: Get the name of a given solar term id
* `GET /solar-term`: Get date of all solar terms of all years
* `GET /solar-term/year/[year]`: Get date of all solar terms of a given year
* `GET /solar-term/term/[solar-term-id]`: Get date of a given solar term across years
* `GET /weather/solar-term`: Get weather data of all solar terms across years
* `GET /weather/solar-term/[solar-term-id]`: Get weather data of a given solar term across years
