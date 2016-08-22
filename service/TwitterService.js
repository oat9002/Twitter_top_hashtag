import Twit from 'twit'
import { db } from '../db'
import cron from 'cron'
import twitText from 'twitter-text'

let cronJob = cron.CronJob

export function getHashtag() {
  return new Promise((resolve, reject) => {
    db.twitter.find((err, document) => {
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
          arrHashtag.forEach((hashtag) => {
            let temp = {}
            temp.text = hashtag
            temp.count = 1
            topHashtags.push(temp)
          })
        }
        else {
          arrHashtag.forEach(hashtag => {
            topHashtags.forEach(topHashtag => {
              if(hashtag === topHashtag.text) {
                topHashtag.count = topHashtag.count + 1
              }
              else {
                let temp = {}
                temp.text = hashtag
                temp.count = 1
                topHashtags.push(temp)
              }
            })
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
//save tweets every 30 minutes
// let saveTweetJob = new cronJob('* */30 * * * *', () => {
//   getAllQuery().then(docs => {
//     docs.forEach(item => {
//       T.get('search/tweets', { q: item.query}, (err, data) => {
//         if(err) {
//           console.log(err.stack)
//         }
//         else {
//           saveTweet(data)
//         }
//       })
//     })
//   })
//   .catch((err) => {
//     console.log(err)
//   })
// },
// () => {
//   console.log('saveTweetJob has stopped')
// },
// true
// )
