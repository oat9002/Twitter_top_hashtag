"use strict";
import express from 'express'
import * as TwitterService from '../service/TwitterService'

let twitterRouter = express.Router()

twitterRouter.route('/').get((req, res) => {
  res.send('<h1>Hello Twitter top anything service</h1>')
})

twitterRouter.route('/getHashtag').get((req, res) => {
  TwitterService.getHashtag().then(hashtag => {
    res.send(hashtag)
  })
})

twitterRouter.route('/getRankHashtag').get((req, res) => {
  TwitterService.getRankHashtag().then(rankHashtag => {
    res.send(rankHashtag)
  })
})

twitterRouter.route('/getTopFiveHashtag').get((req, res) => {
  TwitterService.getTopFiveHashtag().then(topFiveHashtag => {
    res.send({hashtags: topFiveHashtag})
  })
})

twitterRouter.route('/getFiveLatestTweet').get((req, res) => {
  TwitterService.getFiveLatestTweet().then(tweets => {
    res.send({tweets: tweets})
  })
})

export default twitterRouter
