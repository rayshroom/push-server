const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const webpush = require('web-push');

require('dotenv').config('conf.env');

const port = (process.env.PORT || 7260);
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
// app.use(express.static(path.join(__dirname, '../build')));

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(process.env.CONTACT_EMAIL, publicVapidKey, privateVapidKey);

const _subscriptions = [];

app.post('/api/subscribe', (req, res) => {
    const subscription = req.body;
    const sub = _subscriptions.find(elm => elm.endpoint === subscription.endpoint);

    if (sub) {
        const msg = "Subscription already exists";
        console.log(msg, sub);
        res.status(201).json({msg: msg});
    } else {
        _subscriptions.push(subscription);
        console.log(subscription);
        res.status(201).json({msg: 'Subscription successful'});
    }
});

app.post('/api/unsubscribe', (req, res) => {
    const subscription = req.body;
    const sub = _subscriptions.find(elm => elm.endpoint === subscription.endpoint);
    const index = _subscriptions.indexOf(sub);

    if (index !== -1) {
        _subscriptions.splice(index, 1);
        const msg = "Subscription removed";
        console.log(msg, sub);
        res.status(201).json({msg: msg});
    } else {
        const msg = "Subscription not found";
        res.status(201).json({msg: msg});
    }
});

app.post('/api/send_push_message', (req, res) => {
    // TODO: adjust according your needs
    const msg = req.body.msg;
    const title = req.body.title;

    /**
     * TODO: add code here to save the pushed message to your
     * own backend alerts collection
     */
    const POST_TO_ALERTS = "https://moves-backend-a.herokuapp.com/api/announcement/add";
    try {
        fetch(POST_TO_ALERTS, {
            method: "POST",
            body: {
                "shortName": title,
                "category": "Alert",
                "dateCreated": "2019-08-16T09:44:49+0000",
                "dateExpired": "2019-10-16T09:44:49+0000",
                "targetCountry": "Denmark",
                "targetRegion": "Aarhus",
                "visibility": [],
                "content": `<h3>${msh}</h3>`
            }
        }).then(data => console.log(data)).catch(e => console.log(e));
    } catch(e) { console.log(e)};

    _subscriptions.forEach((sub) => {
        const payload = JSON.stringify({
            msg: msg,
            title: title
        });
        console.log('*******Ready to send', payload);
        console.log('---- to subs', sub);
        webpush.sendNotification(sub, payload).catch(error => {
            if (error.statusCode === 410) {
                console.log("Given subscription is no longer active");
                _subscriptions.splice(_subscriptions.indexOf(sub), 1);
                console.log(_subscriptions);
            } else {
                console.error(error.stack, error);
            }
        });
    });
    res.json({msg: "Sending push messages initiated"});
});

app.get('/*', (req, res) => {
    res.status(204).json({msg: 'Please refer to the README.md file in how to use this service'});
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({msg: 'Broke!'});
});

const server = app.listen(port, () => {
    console.log(`Push service running on port ${port}`);
})