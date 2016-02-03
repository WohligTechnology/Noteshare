/**
 * ShareController
 *
 * @description :: Server-side logic for managing Shares
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var gcm = require('node-gcm');
module.exports = {
    save: function (req, res) {
        var i = 0;
        if (req.body) {
            if (req.body.userfrom && req.body.userfrom != "" && sails.ObjectID.isValid(req.body.userfrom) && req.body.email && req.body.email != "") {
                if ((req.body.note && req.body.note != "" && sails.ObjectID.isValid(req.body.note)) || (req.body.folder && req.body.folder != "" && sails.ObjectID.isValid(req.body.folder))) {

                    var emails = req.body.email.split(",");
                    _.each(emails, function (n) {
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
                    var print = function (data) {
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
    delete: function (req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function (data) {
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
    find: function (req, res) {
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
    findone: function (req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                    var print = function (data) {
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
    sendnoti: function (req, res) {
        var message = new gcm.Message();
        var title = "Noteshare";
        var body = " Note has been shared with you";
        message.addNotification('title', title);
        message.addNotification('body', body);
        var reg = "APA91bGkWGHylYXGyaUJxy7-Rs_79c5NmXUKeNV3vWg3RAGwR-Kgm5HIYk5oCgP4d0STqhzoAZlvsSxb0zu3N7KTz4q7JZyzLl9aZ8kZk9ZD29bGEOfTqylwKiNfOq1gFHkJcSLBzyNy";
        var sender = new gcm.Sender('AIzaSyA8mIwgUtfLJAc2BXLWTWfxGadfQdwDc0s');
        sender.send(message, {
            registrationTokens: reg
        }, function (err, response) {
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