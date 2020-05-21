import { JWT } from 'google-auth-library'
import axios from 'axios'
import key from './web-push-test-7fe3a-firebase-adminsdk-twn35-c570831d8a.json'

export async function getAccessToken() {
    const jwtClient = new JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/cloud-platform'], // scope
      null
    )

    const token = await jwtClient.authorize()

    if(token.access_token)
      return token.access_token

    return token
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

export async function pushMessage(token, accessToken) {
  const data = {
    "message": {
      "token" : token, // 目的地 app 的 token
      "notification": {
        "title": "Test Message",
        "body": "Message!!!!!!!!"
      },
      "webpush": {
        "headers": {
          "Urgency": "high"
        },
        "notification": {
          "body": "Web Push Message!!!!!!!!",
          "requireInteraction": "true",
          // "badge": "https://i.imgur.com/AoZ6hZA.png",
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