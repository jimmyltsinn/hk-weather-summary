# Hong Kong Weather Summary
**Disclaimer:**
*Data of this project are retrieved from Hong Kong Observatory. We do not store or host any data on either github or other hosts. It is the user to be responsible for the copyright issues when using, extending or redistributing this project.*

HKO has archived the meteorological observations from 1884, which can be found in [here](http://www.hko.gov.hk/cis/climat_e.htm). To facilitate further analysis and investigation with those data, this project pull the data from HKO website, structure the data, store those into a local database, and provide a server to easily retrieve the meteorological observation with a HTTP request.

This project also extract the solar term (節氣) of every year from the PDF files provided by HKO, and structure the data so that you can easily retrieve the date of solar term in a specific year, as well as the date of a specific solar term across years, from 1901 to 2100.

## Requirement
1. This project uses `pdf-text-extract` in processing solar term data from Hong Kong Observatory. Before you run the `fetch_solar-term.js`, make sure you have `pdftotext` in your path.

  On macOS, `pdftotext` is included in `poppler`. You can install it with homebrew
  ``` bash
brew install poppler
```
  On Ubuntu, it is included in `poppler-utils`:
  ``` bash
sudo apt-get install poppler-utils
```
Check [here](https://github.com/nisaacson/pdf-extract) for other operating system.

## Getting Started
1. Install the dependencies with `$ npm install`.
2. Fetch the weather data and solar term data from Hong Kong Observatory.
  ``` bash
node fetch_weather.js
node fetch_solar-term.js
```
3. Start the web server with either
  ``` bash
node app.js
```
  or
  ``` bash
npm start
```
