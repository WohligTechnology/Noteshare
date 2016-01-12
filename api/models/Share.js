/**
 * Share.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var gcm = require('node-gcm');
module.exports = {
    save: function(data, callback) {
        if (data.userfrom) {
            var user = sails.ObjectID(data.userfrom);
            data.userfrom = sails.ObjectID(data.userfrom);
        }
        delete data.user;
        if (!data._id) {
            data.email = data.email.toLowerCase();
            data._id = sails.ObjectID();
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
                    });
                }
                if (db) {
                    if (data.note) {
                        data.note = sails.ObjectID(data.note);
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
                                                    notifydata.userid = user;
                                                    notifydata.profilepic = userrespo.profilepic;
                                                    Notification.findone(notifydata, function(checkrespo) {
                                                        if (checkrespo.value == "false") {
                                                            Notification.save(notifydata, function(notifyrespo) {
                                                                if (notifyrespo.value != "false") {
                                                                    // var template_name = "share";
                                                                    // var template_content = [{
                                                                    //     "name": "share",
                                                                    //     "content": "share"
                                                                    // }]
                                                                    // var message = {
                                                                    //     "from_email": sails.fromEmail,
                                                                    //     "from_name": sails.fromName,
                                                                    //     "to": [{
                                                                    //         "email": data.email,
                                                                    //         "type": "to"
                                                                    //     }],
                                                                    //     "global_merge_vars": [{
                                                                    //         "name": "note",
                                                                    //         "content": response.title
                                                                    //     }, {
                                                                    //         "name": "sentby",
                                                                    //         "content": userrespo.name
                                                                    //     }]
                                                                    // };
                                                                    // sails.mandrill_client.messages.sendTemplate({
                                                                    //     "template_name": template_name,
                                                                    //     "template_content": template_content,
                                                                    //     "message": message
                                                                    // }, function(result) {
                                                                    if (data2[0].deviceid && data2[0].deviceid[0]) {
                                                                        var message = new gcm.Message();
                                                                        var title = "Noteshare";
                                                                        var body = response.title + " Note has been shared with you by " + userrespo.name;
                                                                        message.addNotification('title', title);
                                                                        message.addNotification('body', body);
                                                                        var sender = new gcm.Sender('AIzaSyC5cKwyfT8_iAg5H62rg5E6DHyg67KVqxE');
                                                                        sender.send(message, {
                                                                            registrationTokens: data2[0].deviceid
                                                                        }, function(err, response) {
                                                                            callback({
                                                                                value: "true",
                                                                                comment: "Mail sent"
                                                                            });
                                                                            db.close();
                                                                        });
                                                                    } else {
                                                                        callback({
                                                                            value: "true",
                                                                            comment: "Mail sent"
                                                                        });
                                                                        db.close();
                                                                    }
                                                                    // }, function(e) {
                                                                    //     callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                                    // });
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
                                                            notifydata.userid = user;
                                                            notifydata.profilepic = userrespo.profilepic;
                                                            Notification.save(notifydata, function(notifyrespo) {
                                                                if (userrespo.value == "true") {
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
                                                                } else {
                                                                    callback({
                                                                        value: "false",
                                                                        comment: "Some Error"
                                                                    });
                                                                    db.close();
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
                    if (data.folder) {
                        data.folder = sails.ObjectID(data.folder);
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
                                data._id = data.folder;
                                data.user = data.userfrom;
                                delete data.note;
                                Folder.findone(data, function(response) {
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
                                                    notifydata.folder = response._id;
                                                    notifydata.foldername = response.name;
                                                    notifydata.username = userrespo.name;
                                                    notifydata.userid = user;
                                                    notifydata.profilepic = userrespo.profilepic;
                                                    // Notification.findone(notifydata, function(checkrespo) {
                                                    //     if (checkrespo.value == "false") {
                                                    Notification.save(notifydata, function(notifyrespo) {
                                                        if (notifyrespo.value != "false") {
                                                            // var template_name = "share";
                                                            // var template_content = [{
                                                            //     "name": "share",
                                                            //     "content": "share"
                                                            // }]
                                                            // var message = {
                                                            //     "from_email": sails.fromEmail,
                                                            //     "from_name": sails.fromName,
                                                            //     "to": [{
                                                            //         "email": data.email,
                                                            //         "type": "to"
                                                            //     }],
                                                            //     "global_merge_vars": [{
                                                            //         "name": "note",
                                                            //         "content": response.title
                                                            //     }, {
                                                            //         "name": "sentby",
                                                            //         "content": userrespo.name
                                                            //     }]
                                                            // };
                                                            // sails.mandrill_client.messages.sendTemplate({
                                                            //     "template_name": template_name,
                                                            //     "template_content": template_content,
                                                            //     "message": message
                                                            // }, function(result) {
                                                            if (data2[0].deviceid && data2[0].deviceid[0]) {
                                                                var message = new gcm.Message();
                                                                var title = "Noteshare";
                                                                var body = response.name + " Folder has been shared with you by " + userrespo.name;
                                                                message.addNotification('title', title);
                                                                message.addNotification('body', body);
                                                                var sender = new gcm.Sender('AIzaSyC5cKwyfT8_iAg5H62rg5E6DHyg67KVqxE');
                                                                sender.send(message, {
                                                                    registrationTokens: data2[0].deviceid
                                                                }, function(err, response) {
                                                                    callback({
                                                                        value: "true",
                                                                        comment: "Mail sent"
                                                                    });
                                                                    db.close();
                                                                });
                                                            } else {
                                                                callback({
                                                                    value: "true",
                                                                    comment: "Mail sent"
                                                                });
                                                                db.close();
                                                            }
                                                            // }, function(e) {
                                                            //     callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                            // });
                                                        } else {
                                                            callback({
                                                                value: "false",
                                                                comment: "User not found"
                                                            });
                                                            db.close();
                                                        }
                                                    });
                                                    //     } else {
                                                    //         callback({
                                                    //             value: "true",
                                                    //             comment: "Mail Sent"
                                                    //         });
                                                    //         db.close();
                                                    //     }
                                                    // });

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
                                                            notifydata.folder = response._id;
                                                            notifydata.foldername = response.name;
                                                            notifydata.username = userrespo.name;
                                                            notifydata.userid = user;
                                                            notifydata.profilepic = userrespo.profilepic;
                                                            Notification.save(notifydata, function(notifyrespo) {
                                                                if (userrespo.value == "true") {
                                                                    // var template_name = "newnote";
                                                                    // var template_content = [{
                                                                    //     "name": "newnote",
                                                                    //     "content": "newnote"
                                                                    // }]
                                                                    // var message = {
                                                                    //     "from_email": sails.fromEmail,
                                                                    //     "from_name": sails.fromName,
                                                                    //     "to": [{
                                                                    //         "email": data.email,
                                                                    //         "type": "to"
                                                                    //     }],
                                                                    //     "global_merge_vars": [{
                                                                    //         "name": "note",
                                                                    //         "content": response.title
                                                                    //     }, {
                                                                    //         "name": "sentby",
                                                                    //         "content": userrespo.name
                                                                    //     }]
                                                                    // };
                                                                    // sails.mandrill_client.messages.sendTemplate({
                                                                    //     "template_name": template_name,
                                                                    //     "template_content": template_content,
                                                                    //     "message": message
                                                                    // }, function(result) {
                                                                    callback({
                                                                        value: "true",
                                                                        comment: "Mail Sent"
                                                                    });
                                                                    db.close();
                                                                    // }, function(e) {
                                                                    //     callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                                                    // });
                                                                } else {
                                                                    callback({
                                                                        value: "false",
                                                                        comment: "Some Error"
                                                                    });
                                                                    db.close();
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
                                            comment: "Folder not found"
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
                }
            });
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
