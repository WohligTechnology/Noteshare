/**
 * ShareController
 *
 * @description :: Server-side logic for managing Shares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var gcm = require('node-gcm');
var apn = require("apn");

module.exports = {
    save: function(req, res) {
        var i = 0;
        if (req.body) {
            if (req.body.userfrom && req.body.userfrom != "" && sails.ObjectID.isValid(req.body.userfrom) && req.body.email && req.body.email != "") {
                if ((req.body.note && req.body.note != "" && sails.ObjectID.isValid(req.body.note)) || (req.body.folder && req.body.folder != "" && sails.ObjectID.isValid(req.body.folder))) {

                    var emails = req.body.email.split(",");
                    _.each(emails, function(n) {
                        var obj = _.cloneDeep(req.body);
                        obj.email = n;
                        share(obj, emails.length);
                    });

                } else {
                    res.json({
                        value: "false",
                        comment: "Id is incorrect"
                    });
                }

                function share(obj, length) {
                    var print = function(data) {
                        i++;
                        data.email = obj.email;
                        if (i == length) {
                            res.json({
                                value: "true"
                            });
                        }
                    }
                    Share.save(obj, print);
                }
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    delete: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Share.delete(req.body, print);
                } else {
                    res.json({
                        value: "false",
                        comment: "Share-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                function callback(data) {
                    res.json(data);
                };
                Share.find(req.body, callback);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function(data) {
                        res.json(data);
                    }
                    Share.findone(req.body, print);
                } else {
                    res.json({
                        value: "false",
                        comment: "Share-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    sendnoti: function(req, res) {
        var message = new gcm.Message();
        var title = "Noteshare";
        var body = " Note has been shared with you";
        message.addNotification('title', title);
        message.addNotification('body', body);
        var reg = ["APA91bHyuCd6KfKwm69zUGUagXDpOZcUkYtsetgrPNwIsz-wkdngKtgNDWVYnAqqnvBSSXAiKkhcDW5g6QqIQxE70rdHylevjz5U6yRryCiVnan92-oc1kIkyaaepnF2F6xSOTqWlcde"];
        var sender = new gcm.Sender('AIzaSyDhPfaMrNrxf3FX4s1WdCP3Jvwccf3uVn0');
        sender.send(message, {
            registrationTokens: reg
        }, function(err, response) {
            console.log(err);
            if (err) {
                res.json({
                    value: "false",
                    comment: err
                });
            } else {
                res.json({
                    value: "true",
                    comment: "Mail sent"
                });
            }
        });
    },
    sendnoti2: function(req, res) {
        var options = {
            cert: './conf/deploycert.pem',
            certData: null,
            key: './conf/deploykey.pem',
            keyData: null,
            production: false,
            ca: null,
            pfx: null,
            pfxData: null,
            port: 2195,
            rejectUnauthorized: true,
            enhanced: true,
            cacheLength: 100,
            autoAdjustCache: true,
            connectionTimeout: 0,
        };
        var apnConnection = new apn.Connection(options);
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = "You have a new message";
        note.payload = { 'messageFrom': 'Vignesh' };
        var myDevice = new apn.Device(req.body.device);
        apnConnection.pushNotification(note, myDevice);
        apnConnection.on('transmitted', function(e) {
            res.json({
                value: true,
                comment: "Transmitted"
            });
        });
    }
};
