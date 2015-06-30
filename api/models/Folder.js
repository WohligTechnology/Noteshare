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
                            var time = logid.getTimestamp().toJSON();
                            var log = {
                                _id: logid,
                                folder: data._id,
                                timestamp: time,
                                type: "create",
                                user: user
                            };
                            db.collection('folder_log').insert(log, function (err, created) {
                                if (created) {
                                    console.log("log created");
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
            var tobechanged = {};
            var attribute = "folder.$.";
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
                        "folder._id": data._id
                    }, {
                        $set: tobechanged
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
                            var time = logid.getTimestamp().toJSON();
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
                                    console.log("log created");
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
                        db.collection("user").update({
                            "_id": user,
                            "note.folder": sails.ObjectID(data._id)
                        }, {
                            $set: {}
                        }, function (err, updated) {
                            if (updated) {

                            }
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                        });
                        var logid = sails.ObjectID();
                        var time = logid.getTimestamp().toJSON();
                        var log = {
                            _id: logid,
                            folder: data._id,
                            timestamp: time,
                            type: "delete",
                            user: user
                        };
                        db.collection('folder_log').insert(log, function (err, created) {
                            if (created) {
                                console.log("log created");
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
    findOne: function (data, callback) {
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
    localtoserver: function (data, callback) {
        if (data.type == "create") {
            delete data.type;
            Folder.save(data, callback);
        } else if (data.type == "update") {
            delete data.type;
            Folder.save(data, callback);
        } else if (data.type == "delete") {
            delete data.type;
            Folder.delete(data, callback);
        }
    },
    servertolocal: function (data, callback) {
        if (data.type == "create") {
            delete data.type;
            Folder.save(data, callback);
        } else if (data.type == "update") {
            delete data.type;
            Folder.save(data, callback);
        } else if (data.type == "delete") {
            delete data.type;
            Folder.delete(data, callback);
        }
    }
};