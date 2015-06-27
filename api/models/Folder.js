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
                            callback(updated);
//                            var logid = sails.ObjectID();
//                            var log = {
//                                _id: logid,
//                                folder: data._id,
//                                timestamp: getTimestamp(),
//                                type: "create",
//                                user: user
//                            };
//                            db.collection('folder_log').insert(log, function (err, created) {
//                                if (created) {
//                                    concole.log("log created");
//                                }
//                                if (err) {
//                                    console.log(err);
//                                }
//                            });
                        }
                    });
                }
            });
        } else {
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
                        "folder._id": sails.ObjectID(data._id)
                    }, {
                        $set: {
                            "folder.$": data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            callback(updated);
//                            var logid = sails.ObjectID();
//                            var log = {
//                                _id: logid,
//                                folder: data._id,
//                                timestamp: getTimestamp(),
//                                type: "update",
//                                user: user
//                            };
//                            db.collection('folder_log').insert(log, function (err, created) {
//                                if (created) {
//                                    concole.log("log created");
//                                }
//                                if (err) {
//                                    console.log(err);
//                                }
//                            });
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
                        callback(updated);
//                        var logid = sails.ObjectID();
//                        var log = {
//                            _id: logid,
//                            folder: data._id,
//                            timestamp: getTimestamp(),
//                            type: "delete",
//                            user: user
//                        };
//                        db.collection('folder_log').insert(log, function (err, created) {
//                            if (created) {
//                                concole.log("log created");
//                            }
//                            if (err) {
//                                console.log(err);
//                            }
//                        });
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
//                        var logid = sails.ObjectID();
//                        var log = {
//                            _id: logid,
//                            folder: data._id,
//                            timestamp: getTimestamp(),
//                            type: "findone",
//                            user: user
//                        };
//                        db.collection('folder_log').insert(log, function (err, created) {
//                            if (created) {
//                                concole.log("log created");
//                            }
//                            if (err) {
//                                console.log(err);
//                            }
//                        });
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
            }
            if (db) {

                db.collection("user").find({
                    "_id": user
                }).each(function (err, data) {
                    if (data != null) {
                        callback(data.folder);
//                        var logid = sails.ObjectID();
//                        var log = {
//                            _id: logid,
//                            folder: data._id,
//                            timestamp: getTimestamp(),
//                            type: "find",
//                            user: user
//                        };
//                        db.collection('folder_log').insert(log, function (err, created) {
//                            if (created) {
//                                concole.log("log created");
//                            }
//                            if (err) {
//                                console.log(err);
//                                callback({
//                                    value: false
//                                });
//                            }
//                        });
                    }
                });
            }
        });
    }
};