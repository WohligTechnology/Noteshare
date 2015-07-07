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
        if (data.remindertime) {
            data.remindertime = new Date(data.remindertime);
        }
        if (data.timebomb) {
            data.timebomb = new Date(data.timebomb);
        }
        console.log(data.timebomb);
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
                    if (!data.creationtime) {
                        data.creationtime = data._id.getTimestamp();
                    }
                    data.modifytime = data.creationtime;
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
                        }
                    });
                }
            });
        } else {
            data._id = sails.ObjectID(data._id);
            if (!data.modifytime) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
            }
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
                        }
                    });
                }
            });
        }
    },
    delete: function (data, callback) {
        var user = sails.ObjectID(data.user);
        delete data.user;
        data._id = sails.ObjectID(data._id);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
                db.collection("user").update({
                    "_id": user,
                    "note._id": data._id
                }, {
                    $set: {
                        "note.$": data
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
                            _id: user,
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
                        $project: {
                            note: 1
                        }
                    }
                ]).toArray(
                    function (err, data) {
                        if (data != null) {
                            callback(data);
                            console.log(data);
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
        if (data.creationtime) {
            Note.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: false
            });
        } else if (data.id && !data.creationtime) {
            Note.delete(data, callback)
        }
    },
    servertolocal: function (data, callback) {
        console.log(data.modifytime);
        var d = new Date(data.modifytime);
        console.log(d);
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
                            _id: user,
                            "note.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $unwind: "$note"
                    },
                    {
                        $match: {
                            "note.modifytime": {
                                $gt: d
                            }
                        }
                    },
                    {
                        $project: {
                            note: 1
                        }
                    }
                ]).toArray(
                    function (err, data) {
                        if (data != null) {
                            callback(data);
                            console.log(data);
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
    timebomb: function (data3, callback) {
        var returns = [];
        var d = new Date(data3.timebomb);
        var exit = 0;
        var exitdown = 0;
        var exitup = 0;
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
                            "note.timebomb": {
                                $lte: d
                            }
                        }
                    },
                    {
                        $unwind: "$note"
                    },
                    {
                        $match: {
                            "note.timebomb": {
                                $lte: d
                            }
                        }
                    },
                    {
                        $project: {
                            note: 1
                        }
                    }
                ]).each(function (err, data2) {
                    if (data2 != null) {
                        exitup++;
                        returns.push(data2.note._id);
                    } else {
                        exit++;
                        if (exit == exitup) {
                            console.log(exitup);
                            console.log(exit);
                            if (returns != "") {
                                for (var i = 0; i < returns.length; i++) {
                                    var data = {};
                                    data._id = sails.ObjectID(returns[i]);
                                    console.log(data._id);
                                    var dummy = sails.ObjectID();
                                    data.modifytime = dummy.getTimestamp();
                                    db.collection("user").update({
                                        "note._id": data._id
                                    }, {
                                        $set: {
                                            'note.$.folder': ''
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
                                            console.log("data");
                                        }
                                    });
                                }
                            }
                            if (returns == "") {
                                callback("No timebombs.");
                            }
                        }
                    }
                    if (data2 == null) {
                        if (exit != exitup) {
                            console.log("No Timebombs.");
                            callback("No Timebombs.")
                        }
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