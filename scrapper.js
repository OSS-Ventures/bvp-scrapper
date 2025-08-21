const fs = require('fs')
const jsdom = require('jsdom')
const { DateTime } = require('luxon')
const { JSDOM } = jsdom
const fetch = require('node-fetch')
const Airtable = require('airtable')

require('dotenv').config()

// Read the HTML file
function parse(body) {
  // Parse the HTML with jsdom
  const dom = new JSDOM(body)
  const payload = dom.window.document.getElementById('__NEXT_DATA__')

  if (payload) {
    const jsonData = JSON.parse(payload.textContent).props.pageProps.iotData
    fs.writeFileSync('bvp-history.json', JSON.stringify(jsonData, null, 2), 'utf-8')
    jsonData.forEach(item => {
      const date = new Date(item.date)
      item.date = date.toISOString().split('T')[0]
    })
    fs.writeFileSync('bvp-history.json', JSON.stringify(jsonData, null, 2), 'utf-8')
  } else {
    console.error('Script element with ID "__NEXT_DATA__" not found.')
  }
}

fetch(process.env.BVP_URL)
  .then(res => res.text())
  .then(body => parse(body))
  .then(pushToAirtable())

function pushToAirtable () {
  if (process.env.AIRTABLE_SYNC === true) {
    console.log("Grabbing the last publication for Airtable...")
    const jsonData = JSON.parse(fs.readFileSync('bvp-history.json', 'utf8'))
    const lastObject = jsonData.at(-1)
    console.log(lastObject)
    const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appNcXjwWZvRIix9R')

    base('Cloud Index').create([
      {
        "fields": {
          "date": lastObject.date,
          "median": lastObject.median,
          "topQuartile": lastObject.topQuartile,
          "bottomQuartile": lastObject.bottomQuartile
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      })
    })
  } else {
    console.log('Skipping Airtable sync.')
  }
}
