import express from 'express'
import cors from 'cors'
import path from 'path'
import axios from 'axios'
import asyncHandler from 'express-async-handler'
import { getAccessToken } from './jwt-test.js'

const port = 50005

const app = express()

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

// app.use(cors(corsOptions))
app.use(cors())

// app.use(express.static(path.join(__dirname, 'dist')))

app.use(express.static('.'))

app.post('/push-message', asyncHandler(async (req, res, next) => {
  /* 
    POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send 

    Content-Type: application/json
    Authorization: Bearer [Token]
  */

  const userToken = req.body.token
  const accessToken = await getAccessToken()
  const result = await pushMessage(userToken, accessToken)

  res.send(result.data)
}))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(port, () => {
    console.log(`listening on ${ port }`)
})

async function pushMessage(token, accessToken) {
  // 欄位一覽: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages?hl=zh-TW#Notification
  const data = {
    "message": {
      "token" : token, // 目的地 app 的 token
      "notification": {
        "title": "Test Message",
        "body": "Message!!!!!!!!"
      },
      "webpush": {
        "fcm_options": { // WebpushFcmOptions: https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages?hl=zh-TW#webpushfcmoptions
          "link": "http://localhost:50005" // 點擊通知後會去的網址
        },
        "headers": {
          "Urgency": "high"
        },
        "notification": {
          "body": "Web Push Message!!!!!!!!",
          "requireInteraction": "true",
          "badge": "https://i.imgur.com/AoZ6hZA.png",
          "icon": "https://i.imgur.com/AoZ6hZA.png"
        }
      }
    }
  }

  const project = 'web-push-test-7fe3a'

  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ accessToken }`
    }
  }

  const result = await axios.post(`https://fcm.googleapis.com/v1/projects/${ project }/messages:send`, data, options)

  return result
}

/* 
  POST https://fcm.googleapis.com/v1/projects/{ projectID }/messages:send 

  Content-Type: application/json
  Authorization: Bearer {jwt-token}

  {
    "message": {
      "token" : <token of destination app>,
      "notification": {
        "title": "FCM Message",
        "body": "This is a message from FCM"
      },
      "webpush": {
        "headers": {
          "Urgency": "high"
        },
        "notification": {
          "body": "This is a message from FCM to web",
          "requireInteraction": "true",
          "badge": "/badge-icon.png"
        }
      }
    }
  }
*/