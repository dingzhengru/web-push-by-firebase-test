# web-push-test
用 Firebase Cloud Messaging 試做 web push


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

```bash

POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send

Content-Type: application/json
Authorization: Bearer ya29.ElqKBGN2Ri_Uz...PbJ_uNasm

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
```