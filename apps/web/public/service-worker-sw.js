// @ts-nocheck
// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', function onPush(event) {
  if (!event.data) return
  const data = event.data.json()

  event.waitUntil(
    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://icones.pro/wp-content/uploads/2024/03/blue-bnb-icon-logo-symbol.png',
      image: 'https://icones.pro/wp-content/uploads/2024/03/blue-bnb-icon-logo-symbol.png',
    }),
  )
})
