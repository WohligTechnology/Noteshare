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
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({
                    $or: [{
                        username: {
                            '$regex': check
                        }
                }, {
                        email: {
                            '$regex': check
                        }
                }]
                }, function (err, number) {
                    newreturns.total = number;
                    newreturns.totalpages = Math.ceil(number / data.pagesize);
                    newcallback++;
                    if (newcallback == 2) {
                        callback(newreturns);
                    }

                });
                db.collection("user").find({
                    $or: [{
                        username: {
                            '$regex': check
                        }
                }, {
                        email: {
                            '$regex': check
                        }
                }]
                }, {
                    "firstname": 1,
                    "lastname": 1,
                    "fbid": 1,
                    "email": 1,
                    "gid": 1,
                    "passcode": 1,
                    "profilepic": 1,
                    "username": 1
                }).skip(pagesize * (pagenumber - 1)).limit(pagesize).each(function (err, found) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (found != null) {
                        newreturns.data.push(found);
                    } else {
                        if (found == null) {
                            console.log(newreturns.data);
                            newcallback++;
                            if (newcallback == 2) {
                                callback(newreturns);
                            }
                        }
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        var returns = [];
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
                }).each(function (err, found) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (found != null) {
                        returns.push(found);
                    } else {
                        if (found == null) {
                            callback(returns);
                        }
                    }
                });
            }
        });
    },
    findone: function (data, callback) {
        var newreturn = {};
        var newcallback=0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                
                db.collection
                
                db.collection("user").find({
                    "_id": sails.ObjectID(data._id)
                }, {
                    note: 0,
                    folder: 0,
                    device: 0,
                    feed: 0,
                    share: 0,
                    password: 0
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        for(elem in data)
                        {
                            newreturn[elem]=data[elem];
                        }
                        console.log(data);
                        newcallback++;
                        if (newcallback == 2) {
                            callback(newreturn);
                        }
                    }
                });
            }
        });
    },
    searchmail: function (data, callback) {
        var exit = 0;
        var exitup = 0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                exit++;
                db.collection("user").find({
                    "email": data.email
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        exitup++;
                        callback({
                            value: true
                        });
                    } else {
                        if (exit != exitup) {
                            callback({
                                value: false
                            });
                        }
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
                                email: data.email
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
                    "_id": user,
                    "email": data.email,
                    "password": data.password
                }, {
                    $set: {
                        "password": newpass
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        console.log("Error");
                        callback({
                            value: false
                        });
                    }
                    if (updated) {
                        if (updated.result.nModified == 1) {
                            console.log(updated.result.nModified);
                            callback({
                                value: true
                            });
                        } else {
                            console.log(updated.result.nModified);
                            callback({
                                value: false
                            });
                        }
                    }
                });
            }
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
                                var template_name = "Noteshare";
                                var template_content = [{
                                    "name": "noteshare",
                                    "content": "noteshare"
    }]
                                var message = {
                                    "from_email": "vigneshkasthuri2009@gmail.com",
                                    "from_name": "Wohlig",
                                    "to": [{
                                        "email": data.email,
                                        "type": "to"
        }],
                                    "global_merge_vars": [
                                        {
                                            "name": "password",
                                            "content": text
  }
]
                                };
                                mandrill_client.messages.sendTemplate({
                                    "template_name": template_name,
                                    "template_content": template_content,
                                    "message": message
                                }, function (result) {
                                    console.log(result);
                                    callback(result);
                                }, function (e) {
                                    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                });
                            }
                        });
                    });
                }
            });
        });
    },
    countusers: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").count({}, function (err, number) {
                    if (number != null) {
                        callback(number);
                    }
                });
            }
        });
    },
    countnotes: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            "note.title": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $unwind: "$note"
                    },
                    {
                        $match: {
                            "note.title": {
                                $exists: true
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
                    if (result != null) {
                        callback(result[0].count);
                    }
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                });
            }
        });
    },
};