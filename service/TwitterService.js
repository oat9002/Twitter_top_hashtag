import Twit from 'twit'
import { db } from '../db'
import cron from 'cron'
import twitText from 'twitter-text'

let cronJob = cron.CronJob

export function getHashtag() {
  return new Promise((resolve, reject) => {
    db.tweet.find((err, document) => {
      if(!err) {
        let hashtags = new Array(document.length)
        document.forEach((item, index)=> {
          let hashtag = twitText.extractHashtags(item.text)
          hashtags[index] = hashtag
        })
        resolve(hashtags)
      }
      else {
        reject(err)
      }
    })
  })
 }

export function getRankHashtag() {
  return new Promise((resolve, reject) => {
    let topHashtags = []
    getHashtag().then(hashtags => {
      hashtags.forEach((arrHashtag, index) => {
        if(index == 0) {
          arrHashtag.forEach(hashtag => {
            let temp = {}
            temp.text = hashtag
            temp.count = 1
            topHashtags.push(temp)
          })
        }
        else {
          arrHashtag.forEach((hashtag, a) => {
            let dup = false
            topHashtags.forEach((topHashtag, b) => {
              if(hashtag === topHashtag.text) {
                topHashtag.count = topHashtag.count + 1
                dup = true
              }
            })
            if(!dup) {
              let temp = {}
              temp.text = hashtag
              temp.count = 1
              topHashtags.push(temp)
            }
          })
        }
      })
      resolve(topHashtags)
    })
    .catch(err => {
      reject(err)
    })
  })
}

function generateTopFiveHashtag() {
  return new Promise((resolve, reject) => {
    getRankHashtag().then(rankHashtag => {
      rankHashtag.sort((a, b) => {
        return b.count - a.count
      })
      let topFiveHashtag = new Array(5)
      rankHashtag.slice(0, 5).forEach((hashtag, index) => {
        topFiveHashtag[index] = '#' + hashtag.text
      })
      resolve(topFiveHashtag)
    })
    .catch(err => {
      reject(err)
    })
  })
}

export function getTopFiveHashtag() {
  return new Promise((resolve, reject) => {
    db.topHashtags.find().sort({_id: -1}).limit(1, (err, document) => {
      if(!err) {
        resolve(document[0].hashtags)
      }
      else{
        reject(err)
      }
    })
  })
}

function generateFiveLatestTweet() {
  return new Promise((resolve, reject) => {
    db.tweet.find().sort({created_at: -1}).limit(5, (err, document) => {
      if(!err) {
        resolve(document)
      }
      else {
        reject(err)
      }
    })
  })
}

export function getFiveLatestTweet() {
  return new Promise((resolve, reject) => {
    db.latestTweet.find().sort({_id: -1}).limit(1, (err, document) => {
      if(!err) {
        resolve(document[0].tweets)
      }
      else{
        reject(err)
      }
    })
  })
}

//save method

function saveHastags(hashtags) {
  db.topHashtags.insert({hashtags: hashtags})
}

export function saveLatestTweet(tweets) {
  db.latestTweet.insert({tweets: tweets})
}

// save hashtags every 15 minutes
let saveHastagsJob = new cronJob('*/32 * * * * *', () => {
  generateTopFiveHashtag().then(topFive => {
    saveHastags(topFive)
  })
},
() => {
  console.log('saveHastagsJob has stopped')
},
true
)

// save latestTweet every 15 minutes
let saveLatestTweetJob = new cronJob('*/32 * * * * *', () => {
  generateFiveLatestTweet().then(tweets => {
    saveLatestTweet(tweets)
  })
},
() => {
  console.log('saveLatestTweetJob has stopped')
},
true
)
