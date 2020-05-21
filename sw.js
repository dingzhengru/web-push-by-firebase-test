
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

/*
  這邊是原生的 service worker 的接收事件，可以於 dev tools 點 push 測試效果
  這裡不管是不是在頁面上，只要是收到通知，都一律會進入
  用 firebase 的 Cloud Messaging 推送，這邊也會收到，但就會有兩次通知就是
*/
self.addEventListener('push', event => {
  console.log('[sw.push]', event)

  const title = '推送標題!!'
  const options = {
    body: '推送內容!!',
    icon: './firebase-icon.png'
  }
  self.registration.showNotification(title, options)
})

/*
  Firebase 需設置此，才能在使用者不開啟頁面時收到通知 
  但若使用 firebase 的 Cloud Messaging 推送的話，會直接顯示那邊的設定，就不會進來這裡
  但還是要設置此事件才會收到通知
*/
messaging.setBackgroundMessageHandler(payload => {
  console.log('[sw.setBackgroundMessageHandler] Received background message ', payload)

  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: './firebase-icon.png'
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})
