###Please report any issues to team A

**To set up the keys**, do the following in your terminal/powershell at root

```
npm install web-push -g
web-push generate-vapid-keys
```

Then you will be seeing 1 public key and 1 private key, create a new file called `.env` in the same directory, add the following entries into it. *Remember to add `.env` to `.gitignore` since you don't want it on Github*

```
PUBLIC_VAPID_KEY=thePublicKeyYouGot
PRIVATE_VAPID_KEY=thePrivateKeyYouGot
CONTACT_EMAIL=aValidMailtoLink
```

Remember there are no spaces around the `=` sign and any content you put after the `=` sign

The `.env` file will be handled by npm package `dotenv`, which is included in `package.json`


###Subscribe with service worker

copy(or merge) the content of `addToRegister.js` file to where you registered your service worker.

After you add the contents, change `vapidPublicKey` to the one you just generated, host the service somewhere, and change `API_URL` to the hosting address.

-----------------------

Append the content of `addToServiceWorker.js` to your actual service worker.

Please modify the `/api/send_push_message` accordingly to satisfy your needs.