
importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js")

workbox.routing.registerRoute(
  /.*\.(jpg|gif|png|js|css|html)$/,
  new workbox.strategies.StaleWhileRevalidate()
)


self.addEventListener('install', function() {
  self.skipWaiting()
})