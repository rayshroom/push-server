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