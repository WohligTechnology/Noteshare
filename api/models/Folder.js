/**
 * Folder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var user = sails.ObjectID(data.user);
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
                            folder: data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            callback({
                                value: true
                            });
                            console.log(updated);
                            var logid = sails.ObjectID();
                            var time = logid.getTimestamp().toString();
                            var log = {
                                _id: logid,
                                folder: data._id,
                                timestamp: time,
                                type: "create",
                                user: user
                            };
                            db.collection('folder_log').insert(log, function (err, created) {
                                if (created) {
                                    concole.log("log created");
                                }
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            data._id = sails.ObjectID(data._id);
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
                        "folder._id": data._id
                    }, {
                        $set: {
                            "folder.$": data
                        },
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            callback({
                                value: true
                            });
                            console.log(updated);
                            var logid = sails.ObjectID();
                            var time = logid.getTimestamp().toString();
                            console.log(time);
                            var log = {
                                _id: logid,
                                folder: data._id,
                                timestamp: time,
                                type: "update",
                                user: user
                            };
                            db.collection('folder_log').insert(log, function (err, created) {
                                if (created) {
                                    concole.log("log created");
                                }
                                if (err) {
                                    console.log(err);
                                }
                            });
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
                    "_id": user,

                }, {
                    $pull: {
                        "folder": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function (err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (updated) {
                        callback({
                            value: true
                        });
                        console.log(updated);
                        var logid = sails.ObjectID();
                        var time = logid.getTimestamp().toString();
                        var log = {
                            _id: logid,
                            folder: data._id,
                            timestamp: time,
                            type: "delete",
                            user: user
                        };
                        db.collection('folder_log').insert(log, function (err, created) {
                            if (created) {
                                concole.log("log created");
                            }
                            if (err) {
                                console.log(err);
                            }
                        });
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
                    "folder._id": sails.ObjectID(data._id)
                }, {
                    "folder.$": 1
                }).each(function (err, data2) {
                    if (data2 != null) {
                        callback(data2.folder[0]);
                        console.log("folder findone");
                        var logid = sails.ObjectID();
                        var time = logid.getTimestamp().toString();
                        var log = {
                            _id: logid,
                            folder: data._id,
                            timestamp: time,
                            type: "findone",
                            user: user
                        };
                        db.collection('folder_log').insert(log, function (err, created) {
                            if (created) {
                                concole.log("log created");
                            }
                            if (err) {
                                console.log(err);
                            }
                        });
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

                db.collection("user").find({
                    "_id": user
                }).each(function (err, data) {
                    if (data != null) {
                        callback(data.folder);
                        console.log("folder find");
                        var logid = sails.ObjectID();
                        var time = logid.getTimestamp().toString();
                        var log = {
                            _id: logid,
                            folder: data._id,
                            timestamp: time,
                            type: "find",
                            user: user
                        };
                        db.collection('folder_log').insert(log, function (err, created) {
                            if (created) {
                                concole.log("log created");
                            }
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                        });
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
    }
};