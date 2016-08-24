1
"use strict";
import express from 'express'
import bodyParser from 'body-parser'
import twitterRouter from './controller/TwitterController'
import { Twitter } from './model/Twitter'


const port = process.env.port || 7774
let app = express()


// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//parent url
app.route('/').get((req, res) => {
  res.send('<h1>Social REST Api</h1><ul><li>/twitter</li><li>/facebook</li></ul>')
})

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)

  res.setHeader('Access-Control-Allow-Credentials', true)
  // Pass to next layer of middleware
  next();
});

app.use('/twitter', twitterRouter)

//service start
app.listen(port, () => {
  console.log('Starting node.js on port ' + port)
});
