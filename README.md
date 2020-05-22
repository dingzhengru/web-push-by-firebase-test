# web-push-test
用 Firebase Cloud Messaging 試做 web push

參考: https://medium.com/front-end-augustus-study-notes/firebase-cloud-messaging-web-push-8ebf09e6b15b  
參考: https://letswrite.tw/pwa-web-push/  

上面是同篇，下面才看的到程式碼，不過上面架構比較好讀  

## Firebase Cloud Messaging (FCM) - Legacy HTTP API or HTTP V1 API?
* 參考: https://stackoverflow.com/questions/49193051/firebase-cloud-messaging-fcm-http-v1-api-or-legacy-http-api
* 現在傳送通知有兩種方式，舊版雖簡單方便，但較不安全，新版 V1 是用 OAuth2 的驗證模式 (其實是JSON Web Token (JWT) 跟 Oauth2 不同)

### 舊版 API
* 參考: https://www.freecodecamp.org/news/how-to-add-push-notifications-to-a-web-app-with-firebase-528a702e13e1/

### 新版 API
* 可以於 Cloud Messaging 進行測試 
* 會需要用到以下工具與檔案
* 參考: https://stackoverflow.com/questions/51064260/getting-request-had-invalid-authentication-credentials-error-fcm
* firebase 的 私鑰.json(專案 => 服務帳戶 => 產生新的私鑰)
* google-auth-library-nodejs: 透過 JSON Web Token (JWT) 方式讀取私鑰取得 access_token 
* 會需要後端透過 JWT 讀取私鑰 取得 access_token 後再用下面的 API 傳送通知

## 注意點
* sw.js 中的 setBackgroundMessageHandler，通知寫好的狀態下是不會呼叫的，參考: [這裡](https://firebase.google.com/docs/cloud-messaging/js/receive#setting_notification_options_in_the_service_worker)
* 即使不設置 setBackgroundMessageHandler，也要把 firebase & firebase.message 引入至 sw.js 中，且要執行到 ```const messaging = firebase.messaging()```


## jwt
* 產出 access_token，用於 Message API 的 Authorization

jwt-test.js
```js
import { JWT } from 'google-auth-library'
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
```


## Firebase Message API
* access_token: jwt 用 firebase 的私鑰產出來的(專案設定 => 服務帳戶 => 產生新的私鑰)
* token: 接收者的 token，需由前端等使用者同意接收通知後才會產生出來，再傳給後端即可
* 此為傳給特定 token 的方法

```bash
POST https://fcm.googleapis.com/v1/projects/{ project-id }/messages:send

Content-Type: application/json
Authorization: Bearer {access_token}
```

Message Object
``` js
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
      "notification": {
        "body": "Web Push Message!!!!!!!!",
        "requireInteraction": "true",
        "badge": "https://i.imgur.com/AoZ6hZA.png",
        "icon": "https://i.imgur.com/AoZ6hZA.png"
      }
    }
  }
}
```

## 群體傳送通知
* 有兩種方式，參考: https://firebase.google.com/docs/cloud-messaging/js/send-multiple
* Topic messaging: 為各個 token 設置 Topic，對某個 Topic 傳送即可
* Device group messaging: 裝置群組

### Topic
* 參考: https://firebase.google.com/docs/cloud-messaging/js/topic-messaging
* 為 token 設置主題名稱 => 指定主題傳送通知

為 token 設置主題名稱
```bash
https://iid.googleapis.com/iid/v1/{ REGISTRATION_TOKEN }/rel/topics/{ TOPIC_NAME }

Content-Type:application/json
Authorization:key={ 網路 API 金鑰 }
```

指定主題傳送通知
``` bash
https://fcm.googleapis.com//v1/projects/{ YOUR-PROJECT-ID }/messages:send
Content-Type: application/json
Authorization: bearer { YOUR-ACCESS-TOKEN }
{
  "message": {
    "topic": { TOPIC_NAME }
    "notification": {
      "title": "Background Message Title",
      "body": "Background message body"
    },
    "webpush": {
      "fcm_options": {
        "link": "https://dummypage.com"
      }
    }
  }
}
```

### Device group
* 參考: https://firebase.google.com/docs/cloud-messaging/js/device-group
* 創建設備組 => 取得 notification_key
* 新增用戶至設備組 => 取得 notification_key
* 正常推播訊息會是
  * 查詢 notification_key (用 notification_key_name 查詢) => 取得 notification_key => 傳送通知至此設備組
* 創建的時候需新增用戶進去，用戶為空時會自動刪除該設備組，用戶是指 registration_ids (fcm_tokens，用戶同意接收通知時會收到的 token)

**創建設備組** 
``` bash
# API_KEY: 專案的 api key
# notification_key_name: 設備群組名稱，不可重複
# registration_ids: 用戶的 token
# 回傳的 notification_key:  只是 notification_key_name 的安全型態，還是代表其設備組

https://fcm.googleapis.com/fcm/notification

Content-Type:application/json
Authorization:key={API_KEY}
project_id:SENDER_ID

{
   "operation": "create",
   "notification_key_name": "appUser-Chris",
   "registration_ids": ["4", "8", "15", "16", "23", "42"]
}
```

回傳資料 (保存 notification_key_name & notification_key 以便後續動作)
```bash
{ "notification_key": "APA91bGHXQBB...9QgnYOEURwm0I3lmyqzk2TXQ" }
```

查詢 notification_key

``` bash
GET https://fcm.googleapis.com/fcm/notification?notification_key_name=appUser-Chris
Content-Type:application/json
Authorization:key=API_KEY
project_id:SENDER_ID
{}
```

新增用戶至設備組

將 "51" 新增至 "appUser-Chris"
```

https://fcm.googleapis.com/fcm/notification

{
   "operation": "add",
   "notification_key_name": "appUser-Chris",
   "notification_key": "APA91bGHXQBB...9QgnYOEURwm0I3lmyqzk2TXQ",
   "registration_ids": ["51"]
}
```

傳送通知

``` bash

https://fcm.googleapis.com/fcm/send
Content-Type:application/json
Authorization:key=AIzaSyZ-1u...0GBYzPu7Udno5aA

{
  "to": "{ notification_key }",
  "data": {
    "hello": "This is a Firebase Cloud Messaging Device Group Message!",
   }
}
```