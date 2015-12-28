/**
 * ShareController
 *
 * @description :: Server-side logic for managing Shares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var gcm = require('node-gcm');
module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body.userfrom && req.body.userfrom != "" && sails.ObjectID.isValid(req.body.userfrom)) {
                if (req.body.note) {
                    if (req.body.note != "" && sails.ObjectID.isValid(req.body.note)) {
                        share();
                    } else {
                        res.json({
                            value: "false",
                            comment: "Share-id is incorrect"
                        });
                    }
                } else {
                    share();
                }

                function share() {
                    var print = function(data) {
                        res.json(data);
                    }
                    Share.save(req.body, print);
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
        var reg = "APA91bGkWGHylYXGyaUJxy7-Rs_79c5NmXUKeNV3vWg3RAGwR-Kgm5HIYk5oCgP4d0STqhzoAZlvsSxb0zu3N7KTz4q7JZyzLl9aZ8kZk9ZD29bGEOfTqylwKiNfOq1gFHkJcSLBzyNy";
        var sender = new gcm.Sender('AIzaSyC5cKwyfT8_iAg5H62rg5E6DHyg67KVqxE');
        sender.send(message, {
            registrationTokens: reg
        }, function(err, response) {
            if (err) {
                callback({
                    value: "false",
                    comment: err
                });
                db.close();
            } else {
                callback({
                    value: "true",
                    comment: "Mail sent"
                });
                db.close();
            }
        });
    }
};
