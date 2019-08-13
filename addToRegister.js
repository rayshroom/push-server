if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
    

    if ('PushManager' in window)  subscribeToPush();
    else console.error('Push is not supported');
  }
  const vapidPublicKey = 'BHu0G9M6gwhxw1DTcz6Vc9d7h5SfBOJxhQg33Hctt8z2GFsaIyD_X8JX1ut8LET5_xB2CwwjNrSJiq7EGu-lGAE';
  const API_URL = "https://push-server-moves-a.herokuapp.com/api";
  function subscribeToPush() {
        navigator.serviceWorker.ready.then(
            function (serviceWorkerRegistration) {
                // Register to push events here
                // The server key has to be encoded using this function to work with the Push API
                const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
                const options = {
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                };
                // This method will create the subscription (or retrive an existing one)
                serviceWorkerRegistration.pushManager.subscribe(options).then(
                    function (pushSubscription) { // And this callback will get the subscription
                        console.log(pushSubscription);
                        fetch(`${API_URL}/subscribe`, { // And now we can send it to our server.
                            method: 'post',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(pushSubscription), // Our subscription is sent as JSON in the body
                        }).catch(error => console.error(error));
                    }, function (error) {
                        console.log(error);
                    }
                );
            });
    }

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}