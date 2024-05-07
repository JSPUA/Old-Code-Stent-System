self.addEventListener('push', function(event) {
  const payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon
    })
  );
});