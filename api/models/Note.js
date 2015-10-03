/**
 * Note.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        var user = sails.ObjectID(data.user);
        if (data.folder) {
            data.folder = sails.ObjectID(data.folder);
        }
        if (data.remindertime) {
            data.remindertime = new Date(data.remindertime);
        }
        if (data.timebomb) {
            data.timebomb = new Date(data.timebomb);
        }
        delete data.user;
        if (!data._id) {
            data._id = sails.ObjectID();
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
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
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (updated) {
                            callback({
                                value: "true",
                                id: data._id
                            });
                            db.close();
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
            if (!data.modifytime) {
                var dummy = sails.ObjectID();
                data.modifytime = dummy.getTimestamp();
            }
            var tobechanged = {};
            var attribute = "note.$.";
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
                        "note._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
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
        delete data.user;
        data._id = sails.ObjectID(data._id);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
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
                    "note._id": sails.ObjectID(data._id)
                }, {
                    "note.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].note && data2[0].note[0]) {
                        callback(data2[0].note[0]);
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
                        _id: user
                    }
                }, {
                    $unwind: "$note"
                }, {
                    $match: {
                        "note.title": {
                            $exists: "true"
                        }
                    }
                }, {
                    $project: {
                        note: 1
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
    },
    findlimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
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
                    $unwind: "$note"
                }, {
                    $match: {
                        "note.title": {
                            $exists: "true"
                        },
                        "note.title": {
                            $regex: check
                        }
                    }
                }, {
                    $group: {
                        _id: user,
                        count: {
                            $sum: 1
                        }
                    }
                }, {
                    $project: {
                        count: 1
                    }
                }]).toArray(function(err, result) {
                    if (result[0]) {
                        newreturns.total = result[0].count;
                        newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
                        callbackfunc();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else {
                        callback({
                            value: "false",
                            comment: "Count of null"
                        });
                        db.close();
                    }
                });

                function callbackfunc() {
                    db.collection("user").aggregate([{
                        $match: {
                            _id: user
                        }
                    }, {
                        $unwind: "$note"
                    }, {
                        $match: {
                            "note.title": {
                                $exists: "true"
                            },
                            "note.title": {
                                $regex: check
                            }
                        }
                    }, {
                        $project: {
                            note: 1
                        }
                    }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (found && found[0]) {
                            newreturns.data = found;
                            callback(newreturns);
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
            }
        });
    },
    localtoserver: function(data, callback) {
        if (data.creationtime) {
            Note.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: "false"
            });
        } else if (data._id && !data.creationtime) {
            Note.delete(data, callback)
        }
    },
    servertolocal: function(data, callback) {
        var d = new Date(data.modifytime);
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
                        "note.modifytime": {
                            $gt: d
                        }
                    }
                }, {
                    $unwind: "$note"
                }, {
                    $match: {
                        "note.modifytime": {
                            $gt: d
                        }
                    }
                }, {
                    $project: {
                        note: 1
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
    },
    timebomb: function(data3, callback) {
        var returns = [];
        var d = new Date(data3.timebomb);
        var exit = 0;
        var mycall = 0;
        var exitup = 0;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                exitup++;
                db.collection("user").aggregate([{
                    $match: {
                        "note.timebomb": {
                            $lte: d
                        }
                    }
                }, {
                    $unwind: "$note"
                }, {
                    $match: {
                        "note.timebomb": {
                            $lte: d
                        }
                    }
                }, {
                    $project: {
                        note: 1
                    }
                }]).each(function(err, data2) {
                    if (data2 != null) {
                        returns.push(data2.note._id);
                    } else {
                        exit++;
                        if (exit == exitup) {
                            if (returns != "") {
                                for (var i = 0; i < returns.length; i++) {
                                    var data = {};
                                    data._id = sails.ObjectID(returns[i]);
                                    var dummy = sails.ObjectID();
                                    data.modifytime = dummy.getTimestamp();
                                    db.collection("user").update({
                                        "note._id": sails.ObjectID(returns[i])
                                    }, {
                                        $set: {
                                            "note.$": data
                                        }
                                    }, function(err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                        } else if (updated) {
                                            mycall++;
                                            if (mycall == returns.length) {
                                                callback({
                                                    value: "true"
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                            if (returns == "") {
                                callback({
                                    value: "false",
                                    comment: "No data found"
                                });
                            }
                        }
                    }
                    if (data2 == null) {
                        if (exit != exitup) {
                            callback({
                                value: "false",
                                comment: "No data found"
                            });
                        }
                    }
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                    }
                });
            }
        });
    }
};