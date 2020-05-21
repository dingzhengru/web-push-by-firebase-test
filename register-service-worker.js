
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('sw registered')

      const messaging = firebase.messaging()

      messaging.useServiceWorker(registration)

      messaging.usePublicVapidKey("BF0AaH-_kssWsJLFBj1IFeCzFT0vucJ5emhTzfKt0xCb5UBLuyqmQilknFilkUPDe53GR-rIGr0NIZgFmxaTuMU")

      // token 等同於一個使用者，看要不要存起來
      // 或者就一直對全體傳送通知
      messaging.getToken().then(currentToken => {
        if (currentToken) {
          console.log('currentToken', currentToken)

          Cookies.set('message-token', currentToken) // 放 Cookie

          // sendTokenToServer(currentToken)
          // updateUIForPushEnabled(currentToken)
        } else {
          // Show permission request.
          Cookies.remove('message-token', currentToken) // 刪除 Cookie
          console.log('No Instance ID token available. Request permission to generate one.')
          // Show permission UI.
          // updateUIForPushPermissionRequired()
          // setTokenSentToServer(false)
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err)
        // showToken('Error retrieving Instance ID token. ', err)
        // setTokenSentToServer(false)
      })

      /*
        接受web push有2種情況：
        
          1.使用者正開啟頁面
          2.使用者沒有開啟頁面
        
        第一種情況，是在index.js下寫一個messaging.onMessage的function處理。
        第二種情況，是在sw.js下寫一個messaging.setBackgroundMessageHandler的function處理。

        下面的是處理第一種情況: 使用者正開啟頁面
      */
      messaging.onMessage(payload => {
        console.log('推播訊息: 使用者正開啟頁面', payload);
      })

      // messaging.onTokenRefresh(() => {
      //   messaging.getToken().then(refreshedToken => {
      //     console.log('Token refreshed.', refreshedToken)
      //     // Indicate that the new Instance ID token has not yet been sent to the
      //     // app server.
      //     // setTokenSentToServer(false)
      //     // Send Instance ID token to app server.
      //     // sendTokenToServer(refreshedToken)
      //     // ...
      //   }).catch((err) => {
      //     console.log('Unable to retrieve refreshed token ', err)
      //     // showToken('Unable to retrieve refreshed token ', err)
      //   })
      // })
    })
  })
}
