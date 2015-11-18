/**
 * Feed.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        var user = sails.ObjectID(data.user);
        delete data.user;
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: "false",
                        comment:"Error"
                    });
                } else if (db) {
                    data.timestamp = data._id.getTimestamp().toString();
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            feed: data
                        }
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false",
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated) {
                            var userdata = {};
                            userdata._id = user;
                            User.findoneuser(userdata, function(userrespo) {
                                if (!userrespo.value) {
                                    var template_name = "feed";
                                    var template_content = [{
                                        "name": "feed",
                                        "content": "feed"
                                    }]
                                    var message = {
                                        "from_email": userrespo.email,
                                        "from_name": userrespo.name,
                                        "to": [{
                                            "email": sails.fromEmail,
                                            "type": "to"
                                        }],
                                        "global_merge_vars": [{
                                            "name": "name",
                                            "content": userrespo.name
                                        }, {
                                            "name": "text",
                                            "content": data.text
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
                                        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                        callback({
                                            value: "false",
                                            comment: "Some Error"
                                        });
                                        db.close();
                                    });
                                } else {
                                    callback({
                                        value: "false",
                                        comment: "No data found"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            callback({
                                value: "false",
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            data._id = sails.ObjectID(data._id);
            var tobechanged = {};
            var attribute = "feed.$.";
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
                        "feed._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false",
                                comment: "Error"
                            });
                            db.close();
                        } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                            callback({
                                value: "true"
                            });
                            db.close();
                        } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                            callback({
                                value: "true",
                                comment: "Data already updated"
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
                        "feed": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function(err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false",
                            comment: "Error"
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
                    "feed._id": sails.ObjectID(data._id)
                }, {
                    "feed.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].feed && data2[0].feed[0]) {
                        callback(data2[0].feed[0]);
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
                        _id: user,
                        "feed.text": {
                            $exists: "true"
                        }
                    }
                }, {
                    $unwind: "$feed"
                }, {
                    $match: {
                        "feed.text": {
                            $exists: "true"
                        }
                    }
                }, {
                    $project: {
                        feed: 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
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
