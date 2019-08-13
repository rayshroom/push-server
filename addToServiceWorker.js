// ###### Uncomment the follow lines if you are using workbox injectManifest with
// this file as the source
// importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

// workbox.precaching.precacheAndRoute([]);



self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log("Getting push data", data);

    event.waitUntil(
        // You can check out the documentation for the API here:
        // https://developer.mozilla.org/en-US/docs/Web/API/notification
        // and here for all the options
        // https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
        self.registration.showNotification(
            data.title, {
                body: data.msg,
                vibrate: [500, 100, 500],
            })
    );
});

// TODO: change this to your actual route to annoucement page
const _alerts = "/alerts";

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // We are overriding default behaviour, so we need to close it ourselves.
    event.waitUntil(clients.openWindow(_alerts)); // go to clients
});