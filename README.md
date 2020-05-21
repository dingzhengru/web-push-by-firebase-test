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
```