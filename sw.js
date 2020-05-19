
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js")

console.log('set workbox')

workbox.routing.registerRoute(
  /.*\.(jpg|gif|png|js|css|html)$/,
  new workbox.strategies.StaleWhileRevalidate()
)


self.addEventListener('install', function() {
  self.skipWaiting()
})

// firebase message

importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js')

const firebaseConfig = {
  apiKey: "AIzaSyDHMZxNwp_eyN7wa66xPH5fATXvRZvOwts",
  authDomain: "web-push-test-7fe3a.firebaseapp.com",
  databaseURL: "https://web-push-test-7fe3a.firebaseio.com",
  projectId: "web-push-test-7fe3a",
  storageBucket: "web-push-test-7fe3a.appspot.com",
  messagingSenderId: "194498955675",
  appId: "1:194498955675:web:f5476b22c9089e9537f93e"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

console.log('set messaging')

messaging.setBackgroundMessageHandler(function(payload) {

  console.log(payload)

  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: payload.notification.image
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})
