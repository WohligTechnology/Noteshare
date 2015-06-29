/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var md5 = require('MD5');
var mandrill = require('mandrill-api/mandrill');
mandrill_client = new mandrill.Mandrill('dzbY2mySNE_Zsqr3hsK70A');
module.exports = {
    save: function (data, callback) {
        data.password = md5(data.password);
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function (err, db) {
                var cuser = db.collection('user').insert(data, function (err, created) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (created) {
                        console.log(created);
                        callback({
                            value: true
                        });
                    }
                });
            });
        } else {
            sails.query(function (err, db) {
                var user = sails.ObjectID(data._id);
                delete data._id
                var cuser = db.collection('user').update({
                    _id: user
                }, {
                    $set: data
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (updated) {
                        console.log(updated);
                        callback({
                            value: true
                        });
                    }
                });
            });
        }
    },
    find: function (data, callback) {
        returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({}, {
                    "firstname": 1,
                    "lastname": 1,
                    "fbid": 1,
                    "email": 1,
                    "gid": 1,
                    "passcode": 1,
                    "profilepic": 1,
                    "username": 1
                }).each(function (err, data) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (data != null) {
                        returns.push(data);
                    } else {
                        console.log(returns);
                        callback(returns);
                    }
                });
            }
        });
    },
    findone: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": sails.ObjectID(data._id)
                }, {
                    "firstname": 1,
                    "lastname": 1,
                    "fbid": 1,
                    "email": 1,
                    "gid": 1,
                    "passcode": 1,
                    "profilepic": 1,
                    "username": 1
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        console.log(data);
                        callback(data);
                    }
                });
            }
        });
    },
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cuser = db.collection('user').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
                if (deleted) {
                    console.log(deleted);
                    callback({
                        value: true
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
            });
        });
    },
    login: function (data, callback) {
        var exitup = 0;
        var exit = 0;
        var exitdown = 0;
        data.password = md5(data.password);
        sails.query(function (err, db) {
            db.collection('user').find({
                _id: sails.ObjectID(data._id),
                email: data.email,
                password: data.password
            }, {
                "firstname": 1,
                "lastname": 1,
                "fbid": 1,
                "email": 1,
                "gid": 1,
                "passcode": 1,
                "profilepic": 1,
                "username": 1
            }).each(function (err, found) {
                exitup++;
                if (err) {
                    callback({
                        value: false
                    });
                    console.log(err);
                }
                if (found != null) {
                    callback(found);
                    console.log(found);
                } else {
                    db.collection('user').find({
                        _id: sails.ObjectID(data._id),
                        email: data.email,
                        forgotpassword: data.password
                    }, {
                        "firstname": 1,
                        "lastname": 1,
                        "fbid": 1,
                        "email": 1,
                        "gid": 1,
                        "passcode": 1,
                        "profilepic": 1,
                        "username": 1
                    }).each(function (err, found) {
                        exit++;
                        if (err) {
                            callback({
                                value: false
                            });
                            console.log(err);
                        }
                        if (found != null) {
                            callback(found);
                            sails.ObjectID(data._id);
                            db.collection('user').update({
                                _id: sails.ObjectID(data._id)
                            }, {
                                $set: {
                                    forgotpassword: "",
                                    password: data.password
                                }
                            }, function (err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false
                                    });
                                }
                                if (updated) {
                                    console.log(updated);
                                }
                            });
                        } else {
                            exitdown++;
                            console.log(exit);
                            console.log(exitup);
                            console.log(exitdown);
                            if (exit == exitup == exitdown) {
                                callback({
                                    value: false
                                });
                            }
                        }
                    });
                }
            });
        });
    },
    forgotpassword: function (data, callback) {
        sails.query(function (err, db) {
            db.collection('user').find({
                email: data.email
            }).each(function (err, data) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (data != null) {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    for (var i = 0; i < 8; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    console.log(text);
                    var encrypttext = md5(text);
                    sails.query(function (err, db) {
                        var user = sails.ObjectID(data._id);
                        db.collection('user').update({
                            email: data.email
                        }, {
                            $set: {
                                forgotpassword: encrypttext
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                            if (updated) {
                                console.log(updated);
                                callback(text);
                            }
                        });
                    });
                }
            });
        });
    },
    changepassword: function (data, callback) {
        data.password = md5(data.password);
        var user = sails.ObjectID(data._id);
        var newpass = md5(data.editpassword);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (data.editpassword == "") {
                console.log("Password can't be empty.");
                callback({
                    value: false
                });
            }
            if (data.editpassword != "") {
                db.collection('user').update({
                    _id: user,
                    password: data.password
                }, {
                    $set: {
                        password: newpass
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (updated) {
                        console.log(updated);
                        callback({
                            value: true
                        });
                    }
                });
            }
        });
    },
    sendmail: function (callback) {
        var message = {
            "html": "<p>Example HTML content</p>",
            "text": "Example text content",
            "subject": "example subject",
            "from_email": "vigneshkasthuri2009@gmail.com",
            "from_name": "Wohlig",
            "to": [{
                "email": "vigneshkasthuri2009@gmail.com",
                "name": "Vignesh",
                "type": "to"
        }]
        };
        //        var async = false;
        //        var ip_pool = "Main Pool";
        //        var send_at = "example send_at";
        mandrill_client.messages.send({
            "message": message
        }, function (result) {
            console.log(result);
            /*
            [{
                    "email": "recipient.email@example.com",
                    "status": "sent",
                    "reject_reason": "hard-bounce",
                    "_id": "abc123abc123abc123abc123abc123"
                }]
            */
            callback(result);
        }, function (e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });
    }
};