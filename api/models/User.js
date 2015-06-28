/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var md5 = require('MD5');
module.exports = {
    save: function (str, callback) {
        str.password = md5(str.password);
        if (!str._id) {
            str._id = sails.ObjectID();
            sails.query(function (err, db) {
                var cuser = db.collection('user').insert(str, function (err, created) {
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
                var user = sails.ObjectID(str._id);
                delete str._id
                var cuser = db.collection('user').update({
                    _id: user
                }, {
                    $set: str
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
    find: function (str, callback) {
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
                    "name": 1
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
    findone: function (str, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": sails.ObjectID(str._id)
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
    delete: function (str, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cuser = db.collection('user').remove({
                _id: sails.ObjectID(str._id)
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
    login: function (str, callback) {
        var exitup = 0;
        var exit = 0;
        var exitdown = 0;
        str.password = md5(str.password);
        sails.query(function (err, db) {
            db.collection('user').find({
                _id: sails.ObjectID(str._id),
                email: str.email,
                password: str.password
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
                        _id: sails.ObjectID(str._id),
                        email: str.email,
                        forgotpassword: str.password
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
                            sails.ObjectID(str._id);
                            db.collection('user').update({
                                _id: sails.ObjectID(str._id)
                            }, {
                                $set: {
                                    forgotpassword: "",
                                    password: str.password
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
    forgotpassword: function (str, callback) {
        sails.query(function (err, db) {
            db.collection('user').find({
                email: str.email
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
                        var user = sails.ObjectID(str._id);
                        db.collection('user').update({
                            email: str.email
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
    }
};