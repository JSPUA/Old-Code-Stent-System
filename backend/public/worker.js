// console.log("Service Worker Loaded...");

// self.addEventListener("push", e => {
//   const data = e.data.json();
//   console.log("Push Recieved...");
//   self.registration.showNotification(data.title, {
//     body: "Notified by NUST Application",
//     icon: "https://i.ibb.co/Chqt5S0/4.png"
//   });
// });


self.addEventListener('push', function(event) {
  const data = event.data.json(); // Assuming the payload is a JSON string
  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon
  };
  event.waitUntil(self.registration.showNotification(title, options));
});