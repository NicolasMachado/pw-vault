var express = require('express');
var bodyParser = require('body-parser');


var login = require('./utils/login.js');
var emailVerification = require('./utils/email-verification.js');
var mongooseConfig = require('./db/mongoose-config.js');
var usernameRecovery = require('./utils/username-recovery.js');

var jsonParser = bodyParser.json();

//web server
var app = express();

//this serves all the static assets
app.use(express.static(__dirname + '/public'));

app.post('/login-test', jsonParser, function(req, res) {
    login.check(req.body.username, req.body.password, mongooseConfig.userDev)
        .then(function(success) {
            res.status(200).send(success);
        }, function(error) {
            res.status(404).send(error);
        });
});

app.post('/email-verification', jsonParser, function(req, res) {
    emailVerification.check(req.body.email, mongooseConfig.userDev)
        .then(function(success) {
            res.status(200).send(success);
        }, function(error) {
            res.status(404).send(error);
        });
});

app.post('/username-recovery', jsonParser, function(req, res) {
    usernameRecovery.go(req.body._id, req.body.email, mongooseConfig.userDev)
        .then(function(success) {
            //console.log('success=', success);
            res.status(200).send(success);
        }, function(error) {
            //console.log('error=', error);
            res.status(404).send(error);
        });
});

//this sends request for endpoints that don't exist back to angular for routing (as well as dealing with error pages)
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/public/'});
});

app.listen(8080);
console.log("App is listening on port 8080");

exports.app = app;