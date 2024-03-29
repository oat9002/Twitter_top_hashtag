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

export function getTopFiveHashtag() {
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

// function saveHastags(hashtags) {
//   db.topHashtags.insert({hashtags: hashtags})
// }
// //save hashtags every 30 minutes
// let saveHastagsJob = new cronJob('* */30 * * * *', () => {
//   getTopFiveHashtag().then(topFive => {
//     saveHastags(topFive)
//   })
// },
// () => {
//   console.log('saveHastagsJob has stopped')
// },
// true
// )
