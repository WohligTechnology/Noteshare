/**
 * Note.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (data, callback) {
        var user = sails.ObjectID(data.user);
        data.folder = sails.ObjectID(data.folder);
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
                            note: data
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
                                note: data._id,
                                timestamp: time,
                                type: "create",
                                user: user
                            };
                            db.collection('note_log').insert(log, function (err, created) {
                                if (created) {
                                    console.log("log created");
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
            });
        } else {
            data._id = sails.ObjectID(data._id);
            data.folder = sails.ObjectID(data.folder);
            var tobechanged = {};
            var attribute = "note.$.";
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
                        "note._id": data._id
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
                            var log = {
                                _id: logid,
                                note: data._id,
                                timestamp: time,
                                type: "update",
                                user: user
                            };
                            db.collection('note_log').insert(log, function (err, created) {
                                if (created) {
                                    console.log("log created");
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
                        "note": {
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
                        var time = logid.getTimestamp().toJSON();
                        var log = {
                            _id: logid,
                            note: data._id,
                            timestamp: time,
                            type: "delete",
                            user: user
                        };
                        db.collection('note_log').insert(log, function (err, created) {
                            if (created) {
                                console.log("log created");
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
                    "note._id": sails.ObjectID(data._id)
                }, {
                    "note.$": 1
                }).each(function (err, data2) {
                    if (data2 != null) {
                        callback(data2.note[0]);
                        console.log("note findone");
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
        var date = new Date();
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
                        callback(data.note);
                        console.log("note find");
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
            Note.save(data, callback);
        } else if (data.type == "update") {
            delete data.type;
            Note.save(data, callback);
        } else if (data.type == "delete") {
            delete data.type;
            Note.delete(data, callback);
        }
    },
    servertolocal: function (data, callback) {
        if (data.type == "create") {
            delete data.type;
            Note.save(data, callback);
        } else if (data.type == "update") {
            delete data.type;
            Note.save(data, callback);
        } else if (data.type == "delete") {
            delete data.type;
            Note.delete(data, callback);
        }
    }
};