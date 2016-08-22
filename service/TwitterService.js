import Twit from 'twit'
import { db } from '../db'
import cron from 'cron'

let cronJob = cron.CronJob

export function getHashtag() {
  return new Promise((resolve, reject) => {
    db.twitter.findOne({ tweetID: 767400495174398000 }, (err, document) => {
      if(!err) {
        
      }
      else {
        reject(err)
      }
    })
   }
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
