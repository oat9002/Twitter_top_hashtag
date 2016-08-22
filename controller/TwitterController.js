"use strict";
import express from 'express'
import * as TwitterService from '../service/TwitterService'

let twitterRouter = express.Router()

twitterRouter.route('/').get((req, res) => {
  res.send('<h1>Hello Twitter</h1>')
})

twitterRouter.route('/index').get((req, res) => {
  res.send('<h1>This is index page</h1>')
})

twitterRouter.route('/tweet').post((req, res) => {
  res.send(TwitterService.tweet(req.body.status))
})

twitterRouter.route('/searchTweet').post((req, res) => {
  TwitterService.searchTweet(req.body.q)
    .then(result => {
      let arrData = new Array(result.statuses.length)
      result.statuses.forEach((item, index) => {
        let data = {}
        data.text = item.text
        data.textCreatedDate = item.created_at
        arrData[index] = data
      })
      let jsonReturn = {}
      jsonReturn.statuses = arrData
      res.send(jsonReturn)
    })
    .catch(err => {
      console.log(err.stack);
    })
})

twitterRouter.route('/searchTweetNearby').post((req, res) => {
  TwitterService.searchTweetNearby(req.body.lat, req.body.lng, req.body.since)
    .then(result => {
      let arrData = new Array(result.statuses.length)
      result.statuses.forEach((item, index) => {
        let data = {}
        data.tweetID = item.id
        data.text = item.text
        data.textCreatedDate = item.created_at
        data.latitude = req.body.lat
        data.longitude = req.body.lng
        arrData[index] = data
      })
      let jsonReturn = {}
      jsonReturn.statuses = arrData
      res.send(jsonReturn)
    })
})

twitterRouter.route('/addQuery').post((req, res) => {
  TwitterService.addQuery(req.body.query)
})

twitterRouter.route('/getAllTweet').get((req, res) => {
  TwitterService.getAllTweet().then(docs => {
    res.send(docs)
  })
})

twitterRouter.route('/countTweet').get((req, res) => {
  TwitterService.getAllTweet().then(docs => {
    res.send({count: docs.length})
  })
})

export default twitterRouter
