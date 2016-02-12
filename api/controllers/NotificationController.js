/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body._id) {
                    if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                        notify();
                    } else {
                        res.json({
                            value: "false",
                            comment: "Notification-id is incorrect"
                        });
                    }
                } else {
                    notify();
                }
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
                });
            }

            function notify() {
                var print = function(data) {
                    res.json(data);
                }
                Notification.save(req.body, print);
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
                    Notification.delete(req.body, print);
                } else {
                    res.json({
                        value: "false",
                        comment: "Notification-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
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
                Notification.find(req.body, callback);
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
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
                    Notification.findone(req.body, print);
                } else {
                    res.json({
                        value: "false",
                        comment: "Notification-id is incorrect"
                    });
                }
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.pagenumber != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Notification.findlimited(req.body, callback);
                } else {
                    res.json({
                        value: "false",
                        comment: "Please provide parameters"
                    });
                }
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    noteStatus: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user) && ((req.body.note && req.body.note != "" && sails.ObjectID.isValid(req.body.note)) || (req.body.folder && req.body.folder != "" && sails.ObjectID.isValid(req.body.folder) && req.body.userid && req.body.userid != "" && sails.ObjectID.isValid(req.body.userid)))) {
                if (req.body.status && req.body.status != "") {
                    function callback(data) {
                        res.json(data);
                    };
                    Notification.noteStatus(req.body, callback);
                } else {
                    res.json({
                        value: "false",
                        comment: "Please provide status"
                    });
                }
            } else {
                res.json({
                    value: "false",
                    comment: "Id is incorrect "
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    countNoti: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                function callback(data) {
                    res.json(data);
                };
                Notification.countNoti(req.body, callback);
            } else {
                res.json({
                    value: "false",
                    comment: "user-id is incorrect "
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    }
};
