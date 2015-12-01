/**
 * Folder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function(data, callback) {
        if (data.creationtime) {
            data.creationtime = User.formatMyDate(data.creationtime);
        }
        if (data.modifytime) {
            data.modifytime = User.formatMyDate(data.modifytime);
        }
        var user = sails.ObjectID(data.user);
        delete data.user;
        if (!data._id || data._id == "") {
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
                            folder: data
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
            var tobechanged = {};
            var attribute = "folder.$.";
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
                        "folder._id": data._id
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
                                comment: "Data updated"
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
        data.creationtime = "";
        if (data.modifytime) {
            data.modifytime = User.formatMyDate(data.modifytime);
        }
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
                db.collection("user").update({
                    "_id": user,
                    "folder._id": data._id
                }, {
                    $set: {
                        "folder.$": data
                    }
                }, function(err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                    }
                    if (updated) {
                        db.collection("user").update({
                            "_id": user,
                            "note.folder": data._id
                        }, {
                            $set: {
                                "note.folder": " "
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
                    "folder._id": sails.ObjectID(data._id)
                }, {
                    "folder.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].folder && data2[0].folder[0]) {
                        callback(data2[0].folder[0]);
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
                        "folder.name": {
                            $exists: "true"
                        }
                    }
                }, {
                    $unwind: "$folder"
                }, {
                    $match: {
                        "folder.name": {
                            $exists: "true"
                        }
                    }
                }, {
                    $project: {
                        folder: 1
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
    },
    localtoserver: function(data, callback) {
        if (data.creationtime != "0") {
            Folder.save(data, callback);
        } else if (!data._id && !data.creationtime) {
            callback({
                value: "false"
            });
        } else if (data._id && data.creationtime == "0") {
            Folder.delete(data, callback)
        } else {
            callback({
                value: "false"
            });
        }
    },
    servertolocal: function(data, callback) {
        if (data.modifytime) {
            var d = User.formatMyDate(data.modifytime);
        }
        var user = sails.ObjectID(data.user);
        delete data.user;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: user,
                    "folder.modifytime": {
                        $gt: d
                    }
                }, {
                    "folder.$": 1
                }).toArray(function(err, data2) {
                    console.log(data2);
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0] && data2[0].folder && data2[0].folder[0]) {
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
