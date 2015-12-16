/**
 * Share.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    save: function(data, callback) {
        if (data.userfrom) {
            var user = sails.ObjectID(data.userfrom);
            data.userfrom = sails.ObjectID(data.userfrom);
        }
        if (data.note) {
            data.note = sails.ObjectID(data.note);
        }
        delete data.user;
        if (!data._id) {
            if (data.userfrom && data.userfrom != "" && data.email && data.email != "" && data.note && data.note != "") {
                data._id = sails.ObjectID();
                sails.query(function(err, db) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                    }
                    if (db) {
                        db.collection("user").update({
                            _id: user
                        }, {
                            $push: {
                                share: data
                            }
                        }, function(err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: "false"
                                });
                            } else if (updated) {
                                data._id = data.note;
                                data.user = data.userfrom;
                                delete data.note;
                                Note.findone(data, function(response) {
                                    if (response.value != "false") {
                                        db.collection("user").find({
                                            email: data.email
                                        }).toArray(function(err, data2) {
                                            if (err) {
                                                console.log(err);
                                                callback({
                                                    value: "false"
                                                });
                                                db.close();
                                            } else if (data2 && data2[0]) {
                                                var userdata = {};
                                                userdata._id = user;
                                                User.findoneuser(userdata, function(userrespo) {
                                                    var notifydata = {};
                                                    notifydata.user = data2[0]._id;
                                                    notifydata.note = response._id;
                                                    notifydata.notename = response.title;
                                                    notifydata.username = userrespo.name;
                                                    notifydata.profilepic = userrespo.profilepic;
                                                    Notification.findone(notifydata, function(checkrespo) {
                                                        if (checkrespo.value == "false") {
                                                            Notification.save(notifydata, function(notifyrespo) {
                                                                if (notifyrespo.value != "false") {
                                                                    var template_name = "share";
                                                                    var template_content = [{
                                                                        "name": "share",
                                                                        "content": "share"
                                                                    }]
                                                                    var message = {
                                                                        "from_email": sails.fromEmail,
                                                                        "from_name": sails.fromName,
                                                                        "to": [{
                                                                            "email": data.email,
                                                                            "type": "to"
                                                                        }],
                                                                        "global_merge_vars": [{
                                                                            "name": "note",
                                                                            "content": response.title
                                                                        }, {
                                                                            "name": "sentby",
                                                                            "content": userrespo.name
                                                                        }]
                                                                    };
                                                                    sails.mandrill_client.messages.sendTemplate({
                                                                        "template_name": template_name,
                                                                        "template_content": template_content,
                                                                        "message": message
                                                                    }, function(result) {
                                                                        callback({
                                                                            value: "true",
                                                                            comment: "Mail Sent"
                                                                        });
                                                                        db.close();
                                                                    }, function(e) {
                                                                        callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                                    });
                                                                } else {
                                                                    callback({
                                                                        value: "false",
                                                                        comment: "User not found"
                                                                    });
                                                                    db.close();
                                                                }
                                                            });
                                                        } else {
                                                            callback({
                                                                value: "true",
                                                                comment: "Mail Sent"
                                                            });
                                                            db.close();
                                                        }
                                                    });
                                                });
                                            } else {
                                                var newdata = {};
                                                newdata.email = data.email;
                                                User.saveuser(newdata, function(newrespo) {
                                                    if (newrespo.value && newrespo.value == "true") {
                                                        var userdata = {};
                                                        userdata._id = user;
                                                        User.findoneuser(userdata, function(userrespo) {
                                                            var notifydata = {};
                                                            notifydata.user = newrespo._id;
                                                            notifydata.note = response._id;
                                                            notifydata.notename = response.title;
                                                            notifydata.username = userrespo.name;
                                                            Notification.save(notifydata, function(notifyrespo) {
                                                                if (!userrespo.value) {
                                                                    var template_name = "newnote";
                                                                    var template_content = [{
                                                                        "name": "newnote",
                                                                        "content": "newnote"
                                                                    }]
                                                                    var message = {
                                                                        "from_email": sails.fromEmail,
                                                                        "from_name": sails.fromName,
                                                                        "to": [{
                                                                            "email": data.email,
                                                                            "type": "to"
                                                                        }],
                                                                        "global_merge_vars": [{
                                                                            "name": "note",
                                                                            "content": response.title
                                                                        }, {
                                                                            "name": "sentby",
                                                                            "content": userrespo.name
                                                                        }]
                                                                    };
                                                                    sails.mandrill_client.messages.sendTemplate({
                                                                        "template_name": template_name,
                                                                        "template_content": template_content,
                                                                        "message": message
                                                                    }, function(result) {
                                                                        callback({
                                                                            value: "true",
                                                                            comment: "Mail Sent"
                                                                        });
                                                                        db.close();
                                                                    }, function(e) {
                                                                        callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                                    });
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        callback({
                                                            value: "false",
                                                            comment: "Error"
                                                        });
                                                        db.close();
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        callback({
                                            value: "false",
                                            comment: "Note not found"
                                        });
                                        db.close();
                                    }
                                });
                            } else {
                                callback({
                                    value: "false",
                                    comment: "User not found"
                                });
                                db.close();
                            }
                        });
                    }
                });
            } else {
                callback({
                    value: "false",
                    comment: "Please provide sufficient data"
                });
            }
        } else {
            data._id = sails.ObjectID(data._id);
            var tobechanged = {};
            var attribute = "share.$.";
            _.forIn(data, function(value, key) {
                tobechanged[attribute + key] = value;
            });

            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
                    });
                }
                if (db) {
                    db.collection("user").update({
                        "_id": user,
                        "share._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (updated) {
                            callback({
                                value: "true"
                            });
                            db.close();
                        } else {
                            callback({
                                value: "false",
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        }
    },
    delete: function(data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
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
                }, function(err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else if (updated) {
                        callback({
                            value: "true"
                        });
                        db.close();
                    } else {
                        callback({
                            value: "false",
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findone: function(data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": user,
                    "share._id": sails.ObjectID(data._id)
                }, {
                    "share.$": 1
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else if (data2 && data2[0] && data2[0].share && data2[0].share[0]) {
                        callback(data2[0].share[0]);
                        db.close();
                    } else {
                        callback({
                            value: "false",
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function(data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
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
                            $exists: "true"
                        }
                    }
                }, {
                    $project: {
                        share: 1
                    }
                }]).toArray(function(err, data2) {
                    if (data2 && data2[0]) {
                        callback(data2);
                        db.close();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else {
                        callback({
                            value: "false",
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    }
};
