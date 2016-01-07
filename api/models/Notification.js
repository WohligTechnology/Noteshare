module.exports = {
    save: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                var user = sails.ObjectID(data.user);
                delete data.user;
                if (!data._id) {
                    db.collection("user").update({
                        _id: user
                    }, {
                        $push: {
                            notification: data
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
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                } else {
                    data._id = sails.ObjectID(data._id);
                    var tobechanged = {};
                    var attribute = "notification.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("user").update({
                        "_id": user,
                        "notification._id": data._id
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
                                value: "true",
                                comment: "Data updated"
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
            }
        });
    },
    delete: function(data, callback) {
        if (data.note) {
            var matchobj = {
                "note": sails.ObjectID(data.note)
            };
        } else {
            var matchobj = {
                "folder": sails.ObjectID(data.folder)
            };
        }
        if (data.user && data.user != "") {
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
                    db.collection("user").update({
                        _id: user,
                        "notification.status": {
                            $exists: false
                        }
                    }, {
                        $pull: {
                            "notification": matchobj
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
                                comment: "Note rejected"
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
        } else {
            callback({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    //Findlimited
    findlimited: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var user = sails.ObjectID(data.user);
                var matchobj = {
                    "notification.name": {
                        $exists: "true"
                    },
                    "notification.name": {
                        $regex: check
                    }
                };
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("user").aggregate([{
                        $match: {
                            _id: user
                        }
                    }, {
                        $unwind: "$notification"
                    }, {
                        $match: matchobj
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
                        if (result && result[0]) {
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
                            $unwind: "$notification"
                        }, {
                            $match: matchobj
                        }, {
                            $project: {
                                notification: 1
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
            }
        });
    },
    //Findlimited
    findone: function(data, callback) {
        if (data.user && data.user != "") {
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
                        _id: user,
                        "notification.note": sails.ObjectID(data.note)
                    }, {
                        "notification.$": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0] && data2[0].notification && data2[0].notification[0]) {
                            callback(data2[0].notification[0]);
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
        } else {
            callback({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    find: function(data, callback) {
        var lastresult = [];
        var i = 0;
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
                    $unwind: "$notification"
                }, {
                    $match: {
                        "notification.status": {
                            $exists: false
                        }
                    }
                }, {
                    $group: {
                        _id: "$_id",
                        notification: {
                            $addToSet: "$notification"
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        notification: 1
                    }
                }, {
                    $unwind: "$notification"
                }]).toArray(function(err, data2) {
                    if (data2 && data2[0]) {
                        _.each(data2, function(z) {
                            lastresult.push(z.notification);
                            i++;
                            if (i == data2.length) {
                                callback(lastresult);
                                db.close();
                            }
                        });
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
    noteStatus: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                var user = sails.ObjectID(data.user);
                delete data.user;
                if (data.note) {
                    data.note = sails.ObjectID(data.note);
                    var tobechanged = {};
                    var attribute = "notification.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    if (data.status && data.status != "" && data.status == "false") {
                        data.user = user;
                        Notification.delete(data, callback);
                    } else {
                        db.collection("user").update({
                            "_id": user,
                            "notification.note": data.note,
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
                                Note.findbyid(data, function(noterespo) {
                                    if (noterespo.value != "false") {
                                        delete noterespo._id;
                                        noterespo.user = user;
                                        delete noterespo.folder;
                                        noterespo.creationtime = new Date();
                                        noterespo.modifytime = new Date();
                                        Note.save(noterespo, function(saverespo) {
                                            if (saverespo.value != "false") {
                                                callback({
                                                    value: "true",
                                                    comment: "Note accepted"
                                                });
                                                db.close();
                                            } else {
                                                callback({
                                                    value: "false",
                                                    comment: "Note not saved"
                                                });
                                                db.close();
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
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                } else if (data.folder) {
                    data.folder = sails.ObjectID(data.folder);
                    var tobechanged = {};
                    var attribute = "notification.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    if (data.status && data.status != "" && data.status == "false") {
                        data.user = user;
                        Notification.delete(data, callback);
                    } else {
                        db.collection("user").update({
                            "_id": user,
                            "notification.folder": data.folder,
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
                                Folder.findbyid(data, function(folrespo) {
                                    if (folrespo.value != "false") {
                                        var newdata = {};
                                        newdata.user = user;
                                        newdata.name = folrespo.name;
                                        Folder.findbyname(newdata, function(findrespo) {
                                            if (findrespo.value == "false") {
                                                delete folrespo._id;
                                                folrespo.creationtime = new Date();
                                                folrespo.modifytime = new Date();
                                                folrespo.user = user;
                                                Folder.save(folrespo, function(saverespo) {
                                                    if (saverespo.value == "true") {
                                                        var findno = {};
                                                        findno._id = data.folder;
                                                        findno.user = sails.ObjectID(data.userid);
                                                        Folder.findnotes(findno, function(noterespo) {
                                                            if (noterespo.value != "false") {
                                                                var i = 0;
                                                                _.each(noterespo, function(f) {
                                                                    delete f._id;
                                                                    f.folder = sails.ObjectID(saverespo.id);
                                                                    f.user = user;
                                                                    f.creationtime = new Date();
                                                                    f.modifytime = new Date();
                                                                    Note.save(f, function(notesave) {
                                                                        if (notesave.value != "false") {
                                                                            i++;
                                                                            if (i == noterespo.length) {
                                                                                callback({
                                                                                    value: "true",
                                                                                    comment: "Folder accepted"
                                                                                });
                                                                                db.close();
                                                                            }
                                                                        } else {
                                                                            i++;
                                                                            if (i == noterespo.length) {
                                                                                callback({
                                                                                    value: "true",
                                                                                    comment: "Folder accepted"
                                                                                });
                                                                                db.close();
                                                                            }
                                                                        }
                                                                    });
                                                                });
                                                            } else {
                                                                callback({
                                                                    value: "false",
                                                                    comment: "Notes not found"
                                                                });
                                                                db.close();
                                                            }
                                                        });
                                                    } else {
                                                        callback({
                                                            value: "false",
                                                            comment: "Error"
                                                        });
                                                        db.close();
                                                    }
                                                });
                                            } else {
                                                var findno = {};
                                                findno._id = data.folder;
                                                findno.user = sails.ObjectID(data.userid);
                                                Folder.findnotes(findno, function(noterespo) {
                                                    if (noterespo.value != "false") {
                                                        var i = 0;
                                                        _.each(noterespo, function(f) {
                                                            delete f._id;
                                                            f.folder = sails.ObjectID(findrespo._id);
                                                            f.user = user;
                                                            f.creationtime = new Date();
                                                            f.modifytime = new Date();
                                                            Note.save(f, function(notesave) {
                                                                if (notesave.value != "false") {
                                                                    i++;
                                                                    if (i == noterespo.length) {
                                                                        callback({
                                                                            value: "true",
                                                                            comment: "Folder accepted"
                                                                        });
                                                                        db.close();
                                                                    }
                                                                } else {
                                                                    i++;
                                                                    if (i == noterespo.length) {
                                                                        callback({
                                                                            value: "true",
                                                                            comment: "Folder accepted"
                                                                        });
                                                                        db.close();
                                                                    }
                                                                }
                                                            });
                                                        });
                                                    } else {
                                                        callback({
                                                            value: "false",
                                                            comment: "Notes not found"
                                                        });
                                                        db.close();
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        callback({
                                            value: "false",
                                            comment: "No folder found"
                                        });
                                        db.close();
                                    }
                                });
                            } else {
                                callback({
                                    value: "false",
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                } else {
                    callback({
                        value: "false",
                        comment: "Please provide parameters"
                    });
                }
            }
        });
    }
};
