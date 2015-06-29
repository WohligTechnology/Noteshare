/**
 * Note.js
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
                    callback({value:false});
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
                            callback({value:false});
                        }
                        if (updated) {
                            callback({value:true});
                            console.log(updated);
                            //                            var logid = sails.ObjectID();
                            //                            var log = {
                            //                                _id: logid,
                            //                                note: data._id,
                            //                                timestamp: getTimestamp(),
                            //                                type: "create",
                            //                                user: user
                            //                            };
                            //                            db.collection('note_log').insert(log, function (err, created) {
                            //                                if (created) {
                            //                                    concole.log("log created");
                            //                                }
                            //                                if (err) {
                            //                                    console.log(err);
                            //                                    callback({
                            //                                        value: false
                            //                                    });
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
                    callback({value:false});
                }
                if (db) {

                    db.collection("user").update({
                        "_id": user,
                        "note._id": sails.ObjectID(data._id)
                    }, {
                        $set: {
                            "note.$": data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({value:false});
                        }
                        if (updated) {
                            callback({value:true});
                            console.log(updated);
                            //                            var logid = sails.ObjectID();
                            //                            var log = {
                            //                                _id: logid,
                            //                                note: data._id,
                            //                                timestamp: data._id.getTimestamp().tostring(),
                            //                                type: "update",
                            //                                user: user
                            //                            };
                            //                            db.collection('note_log').insert(log, function (err, created) {
                            //                                if (created) {
                            //                                    concole.log("log created");
                            //                                }
                            //                                if (err) {
                            //                                    console.log(err);
                            //                                    callback({
                            //                                        value: false
                            //                                    });
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
                callback({value:false});
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
                        callback({value:false});
                    }
                    if (updated) {
                        callback({value:true});
                        console.log(updated);
                        //                        var logid = sails.ObjectID();
                        //                        var log = {
                        //                            _id: logid,
                        //                            note: data._id,
                        //                            timestamp: getTimestamp(),
                        //                            type: "delete",
                        //                            user: user
                        //                        };
                        //                        db.collection('note_log').insert(log, function (err, created) {
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
    },
    findone: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({value:false});
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
                        console.log(data2);
                        //                        var logid = sails.ObjectID();
                        //                        var log = {
                        //                            _id: logid,
                        //                            note: data._id,
                        //                            timestamp: getTimestamp(),
                        //                            type: "findone",
                        //                            user: user
                        //                        };
                        //                        db.collection('note_log').insert(log, function (err, created) {
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
                        callback(data.note);
                        console.log("note find");
                        console.log(data);
                        //                        var logid = sails.ObjectID();
                        //                        var log = {
                        //                            _id: logid,
                        //                            note: data._id,
                        //                            timestamp: getTimestamp(),
                        //                            type: "find",
                        //                            user: user
                        //                        };
                        //                        db.collection('note_log').insert(log, function (err, created) {
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