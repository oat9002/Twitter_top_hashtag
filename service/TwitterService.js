import Twit from 'twit'
import { db } from '../db'
import cron from 'cron'

let cronJob = cron.CronJob

let T = new Twit({
  consumer_key: 'eFroY0pfuCmbSf4OrwFckHDUY',
  consumer_secret: 'xCJRkrUHuPGAGs7ZCAdKOjqDfIcghzMGjfrS6xLXHZUKwJ430x',
  access_token: '3854752459-6KWXoTPeBbxUdydKsAUNohUru2DBioZ9jmeaIFn',
  access_token_secret: '9qow1TnZqKaWVgZ6V22qcNeqEz5IoFroVOTGs846H6yfQ',
  timeout_ms: 60 * 1000
})

export function tweet(status) {
  return new Promise((resolve, reject) => {
    T.post('statuses/update', { status: status }, (err, data, response) => {
      if(err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}


export function searchTweet(q) {
  return new Promise((resolve, reject) => {
    T.get('search/tweets', { q: q}, (err, data, response) => {
      if(err) {
        reject(err)
      }
      else {
        saveTweet(data)
        resolve(data)
      }
    })
  })
}

function addCoordinate(lat, lng) {

}

export function searchTweetNearby(lat, lng, since) {
  return new Promise((resolve, reject) => {
    T.get('search/tweets', { q: "since:" + since, geocode: "\"" + lat + "," + lng + "," + "1km\"", result_type: 'mixed' }, (err, data, response) => {
      if(err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

function saveTweet(data) {
  data.statuses.forEach(item => {
   db.twitter.findOne({tweetID: item.tweetID}, (err, document) => {
     if(!document) {
       let tweet = {}
       tweet.tweetID = item.id
       tweet.text = item.text
       tweet.textCreatedDate = item.created_at
       db.twitter.insert(tweet, err => {
         if(err) {
           console.log(err)
         }
       })
     }
   })
 })
 console.log('Tweets have been saved')
}

//save tweets every 30 minutes
let saveTweetJob = new cronJob('* */30 * * * *', () => {
  getAllQuery().then(docs => {
    docs.forEach(item => {
      T.get('search/tweets', { q: item.query}, (err, data) => {
        if(err) {
          console.log(err.stack)
        }
        else {
          saveTweet(data)
        }
      })
    })
  })
  .catch((err) => {
    console.log(err)
  })
},
() => {
  console.log('saveTweetJob has stopped')
},
true
)

export function addQuery(query) {
  db.tweetQuery.insert({ query: query }, err => {
    if(err) {
      console.log(err)
    }
  })
  testTweetQuery()
}

function getAllQuery() {
  return new Promise((resolve, reject) => {
    db.tweetQuery.find((err, docs) => {
      if(err) {
        reject(reject)
      }
      else {
        resolve(docs)
      }
    })
  })
}

function testTwitterQuery() {
  db.twitter.find((err, docs) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log(docs)
    }
  })
}

function testTweetQuery() {
  db.tweetQuery.find((err, docs) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log(docs)
    }
  })
}

export function getAllTweet() {
  return new Promise((resolve, reject) => {
    db.twitter.find((err, docs) => {
      if(err) {
        reject(err)
      }
      else {
        resolve(docs)
      }
    })
  })
}
