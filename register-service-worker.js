
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('sw registered')

      const messaging = firebase.messaging()

      messaging.useServiceWorker(registration)

      messaging.usePublicVapidKey("BF0AaH-_kssWsJLFBj1IFeCzFT0vucJ5emhTzfKt0xCb5UBLuyqmQilknFilkUPDe53GR-rIGr0NIZgFmxaTuMU")

      messaging.getToken().then(currentToken => {
        if (currentToken) {
          console.log('currentToken', currentToken)
          // sendTokenToServer(currentToken)
          // updateUIForPushEnabled(currentToken)
        } else {
          // Show permission request.
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

      messaging.onMessage(payload => {
        console.log('Message received. ', payload);
        // ...
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
