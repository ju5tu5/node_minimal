require('dotenv').config()
const express = require('express')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')
app.set('views', './views')

// Stel een static map in
app.use(express.static('public'))

// Maak een route voor de index
app.get('/', function (req, res) {
  // res.send('Hello world!')
  res.render('index', {
    pageTitle: 'Dit is een express pagina',
  })
})

// Maak een route voor quotes
app.get('/quotes', function (req, res) {
  fetchJson('https://quote.api.fdnd.nl/v1/quote').then(function (jsonData) {
    res.render('quotes', {
      pageTitle: 'Dit is de quotes pagina',
      data: jsonData,
    })
  })
})

// Maak een route voor een enkele quote
app.get('/quote/:id', function (req, res) {
  fetchJson(`https://quote.api.fdnd.nl/v1/quote/${req.params.id}`).then(function (jsonData) {
    res.render('quote', {
      pageTitle: 'Dit is een enkele quote pagina',
      quote: jsonData[0],
    })
  })
})

app.set('port', process.env.PORT || 8000)

const server = app.listen(app.get('port'), function () {
  console.log(`Application started on port: ${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((body) => body.data)
    .catch((error) => error)
}
