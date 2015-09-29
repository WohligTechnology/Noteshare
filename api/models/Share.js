/**
 * Share.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var md5 = require('MD5');
var mandrill = require('mandrill-api/mandrill');
mandrill_client = new mandrill.Mandrill('dzbY2mySNE_Zsqr3hsK70A');
module.exports = {
    save: function (data, callback) {
        var user = sails.ObjectID(data.user);
        data.userfrom = sails.ObjectID(data.userfrom);
        data.note = sails.ObjectID(data.note);
        delete data.user;
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            share: data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        } else if (updated) {
                            data._id = data.note;
                            data.user = data.userfrom;
                            delete data.note;
                            Note.findOne(data, function (response) {
                                if (!response.value) {
                                    delete response._id;
                                    db.collection("user").find({
                                        email: data.email
                                    }).toArray(function (err, data2) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: false
                                            });
                                            db.close();
                                        } else if (data2 && data2[0]) {
                                            response.user = data2[0]._id;
                                            Note.save(response, function (noterespo) {
                                                if (noterespo.value == true) {
                                                    var userdata = {};
                                                    userdata._id = user;
                                                    User.findoneuser(userdata, function (userrespo) {
                                                        if (!userrespo.value) {
                                                            var template_name = "share";
                                                            var template_content = [{
                                                                "name": "share",
                                                                "content": "share"
                                                                    }]
                                                            var message = {
                                                                "from_email": userrespo.email,
                                                                "from_name": userrespo.firstname,
                                                                "to": [{
                                                                    "email": data.email,
                                                                    "type": "to"
                                                                    }],
                                                                "global_merge_vars": [{
                                                                    "name": "note",
                                                                    "content": response.title
                                                                    }, {
                                                                    "name": "sentby",
                                                                    "content": userrespo.firstname
                                                                    }]
                                                            };
                                                            mandrill_client.messages.sendTemplate({
                                                                "template_name": template_name,
                                                                "template_content": template_content,
                                                                "message": message
                                                            }, function (result) {
                                                                callback({
                                                                    value: true,
                                                                    comment: "Mail Sent"
                                                                });
                                                                db.close();
                                                            }, function (e) {
                                                                callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            var newdata = {};
                                            newdata.email = data.email;
                                            User.saveuser(newdata, function (newrespo) {
                                                if (newrespo.value && newrespo.value == true) {
                                                    response.user = newrespo._id;
                                                    Note.save(response, function (noterespo) {
                                                        if (noterespo.value == true) {
                                                            var userdata = {};
                                                            userdata._id = user;
                                                            User.findoneuser(userdata, function (userrespo) {
                                                                if (!userrespo.value) {
                                                                    var template_name = "newnote";
                                                                    var template_content = [{
                                                                        "name": "newnote",
                                                                        "content": "newnote"
                                                                    }]
                                                                    var message = {
                                                                        "from_email": userrespo.email,
                                                                        "from_name": userrespo.firstname,
                                                                        "to": [{
                                                                            "email": data.email,
                                                                            "type": "to"
                                                                    }],
                                                                        "global_merge_vars": [{
                                                                            "name": "note",
                                                                            "content": response.title
                                                                            }, {
                                                                            "name": "sentby",
                                                                            "content": userrespo.firstname
                                                                            }]
                                                                    };
                                                                    mandrill_client.messages.sendTemplate({
                                                                        "template_name": template_name,
                                                                        "template_content": template_content,
                                                                        "message": message
                                                                    }, function (result) {
                                                                        callback({
                                                                            value: true,
                                                                            comment: "Mail Sent"
                                                                        });
                                                                        db.close();
                                                                    }, function (e) {
                                                                        callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            data._id = sails.ObjectID(data._id);
            data.userto = sails.ObjectID(data.userto);
            data.userfrom = sails.ObjectID(data.userfrom);
            data.note = sails.ObjectID(data.note);
            var tobechanged = {};
            var attribute = "share.$.";
            _.forIn(data, function (value, key) {
                tobechanged[attribute + key] = value;
            });

            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("user").update({
                        "_id": user,
                        "share._id": data._id
                    }, {
                        $set: tobechanged
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated) {
                            callback({
                                value: true
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Not updated"
                            });
                            db.close();
                        }
                    });
                }
            });
        }
    },
    delete: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").update({
                    "_id": user
                }, {
                    $pull: {
                        "share": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (updated) {
                        callback({
                            value: true
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "Not deleted"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findone: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": user,
                    "share._id": sails.ObjectID(data._id)
                }, {
                    "share.$": 1
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0] && data2[0].share && data2[0].share[0]) {
                        callback(data2[0].share[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "Not found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([{
                    $match: {
                        _id: user
                    }
                }, {
                    $unwind: "$share"
                }, {
                    $match: {
                        "share.email": {
                            $exists: true
                        }
                    }
                }, {
                    $project: {
                        share: 1
                    }
                }]).toArray(function (err, data2) {
                    if (data2 && data2[0]) {
                        callback(data2);
                        db.close();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No Such share."
                        });
                        db.close();
                    }
                });
            }
        });
    }
};