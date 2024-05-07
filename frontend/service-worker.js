// self.addEventListener('push', event => {
//     const data = event.data.json();
//     self.registration.showNotification(data.title, {
//       body: "NUST Notified You",
//       icon: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bostonscientific.com%2Fen-US%2Fproducts%2Fstents--ureteral%2Fpolaris-ultra.html&psig=AOvVaw2PpWUVjQmbRhgVyRVQyeR4&ust=1704711899850000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCND9ou6Qy4MDFQAAAAAdAAAAABAD'
//     });
//   });

self.addEventListener('push', function(event) {
  const data = event.data.json(); // Assuming the payload is a JSON string
  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon
  };
  event.waitUntil(self.registration.showNotification(title, options));
});