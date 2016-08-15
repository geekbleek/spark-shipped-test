var CiscoSparkClient = require('node-ciscospark')
var bearerToken = process.env.sparkToken
var sparkClient = new CiscoSparkClient(bearerToken)
var shippedHostname = process.env.HOST_SPARK_SHIPPED_TEST
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json())

//Listen for inbound webhooks and echo response.  If changing entry point for webhooks, adjust `callbackURL = shippedHostname + '/echo'` as needed in the app.listen function
app.post('/echo', function (req, res) {
    data = req.body.data
    console.log(data)
    sparkClient.getMessage(data.id, function (err, message) {

        //Since we're echo'ing any message we see, change address to your own bot/user address associated with the token, so that you don't get an infinite loop
        if (!err && data.personEmail != 'bob@geekbleek.com') {
            sparkClient.createMessage(data.roomId, message.text, function(err, message) {
                if (err) {
                    console.log(err)
                }
            })
        }
        else {
            console.log(err)
        }
    })
    res.sendStatus(200)    
});

//Cisco Shipped Healthcheck
app.get('/', function (req, res) {
    console.log('Healthy #2')
    res.status(200).send('The hostname is'+shippedHostname)
});


//Mount App to Port 80, clear all existing webhooks for account, and create mass webhook
app.listen(80, function() {
    sparkClient.listWebhooks(100, function (err, webhooks) {
        if (!err) {
            for (i=0;i<webhooks.items.length;i++) {
                sparkClient.deleteWebhook(webhooks.items[i].id, function(err, response) {
                    if (err)
                        console.log(response.message)
                })
            }
        }
    })
        
    webhookParams={}
    webhookParams.resource = 'messages'
    webhookParams.event = 'created'

    callbackURL = shippedHostname + '/echo'
    
    console.log(callbackURL)

    sparkClient.createWebhook("My Cisco Shipped Webhook", callbackURL, 'someroomid', webhookParams, function (err, response) {
        if (err) 
            console.log(err)
    })

    console.log("ciscoShipped Spark app running on port 80");

})