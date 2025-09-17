// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBF5B272OULD7DnXhsgikeS4iMrUWuzNSg",
  authDomain: "university-community-sys-5b08d.firebaseapp.com",
  projectId: "university-community-sys-5b08d",
  storageBucket: "university-community-sys-5b08d.firebasestorage.app",
  messagingSenderId: "87090962201",
  appId: "1:87090962201:web:bceece47b14651a41b6f88",
  measurementId: "G-XWSMC9FN0J",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  console.log("Background Message:", payload);

  const { title, body } = payload.notification || {};
  const url = payload.data?.url || "/"; // Fallback to home page if no URL

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png", // Your app logo
    data: { url }, // Pass URL in notification data
  });
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
