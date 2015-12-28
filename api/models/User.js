/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var moment = require('moment-timezone');
module.exports = {
    formatMyDate: function(str) {
        if (str == "0") {
            return 0;
        } else {
            return moment(str)._d;
        }
    },
    sociallogin: function(data, callback) {
        data.num = 0;
        data.os = "iOS";
        if (data.fbid) {
            var matchobj = {
                fbid: data.fbid,
                num: 0
            };
        } else {
            var matchobj = {
                googleid: data.googleid,
                num: 0
            };
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false",
                    comment: "Error"
                });
            } else if (db) {
                if (data.email) {
                    db.collection('user').find({
                        isreg: "false",
                        email: data.email
                    }).toArray(function(err, data3) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data3 && data3[0]) {
                            data.isreg = "true";
                            db.collection('user').update({
                                _id: sails.ObjectID(data3[0]._id)
                            }, {
                                $set: data
                            }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: "false"
                                    });
                                    db.close();
                                } else if (updated) {
                                    data._id = data3[0]._id;
                                    delete data.num;
                                    delete data.isreg;
                                    callback(data);
                                    db.close();
                                } else {
                                    console.log(err);
                                    callback({
                                        value: "false",
                                        comment: "Error"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            notmail();
                        }
                    });
                } else {
                    notmail();
                }

                function notmail() {
                    db.collection('user').find(matchobj).toArray(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            if (data2[0].profilepic.indexOf("/") != -1) {
                                db.collection('user').update({
                                        _id: sails.ObjectID(data2[0]._id)
                                    }, {
                                        $set: data
                                    },
                                    function(err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                            db.close();
                                        } else if (updated) {
                                            data._id = data2[0]._id;
                                            delete data.num;
                                            delete data.isreg;
                                            callback(data);
                                            db.close();
                                        } else {
                                            callback({
                                                value: "false",
                                                comment: "No data found"
                                            });
                                            db.close();
                                        }
                                    });
                            } else if (data2[0].name != data.name || data2[0].email != data.email) {
                                delete data.profilepic;
                                db.collection('user').update({
                                        _id: sails.ObjectID(data2[0]._id)
                                    }, {
                                        $set: data
                                    },
                                    function(err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                            db.close();
                                        } else if (updated) {
                                            data._id = data2[0]._id;
                                            data.profilepic = data2[0].profilepic;
                                            delete data.num;
                                            delete data.isreg;
                                            callback(data);
                                            db.close();
                                        } else {
                                            callback({
                                                value: "false",
                                                comment: "No data found"
                                            });
                                            db.close();
                                        }
                                    });
                            } else {
                                delete data2[0].num;
                                delete data2[0].isreg;
                                callback(data2[0]);
                                db.close();
                            }
                        } else {
                            data._id = sails.ObjectID();
                            db.collection('user').insert(data, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: "false"
                                    });
                                    db.close();
                                } else if (created) {
                                    delete data.num;
                                    callback(data);
                                    db.close();
                                } else {
                                    callback({
                                        value: "false",
                                        comment: "User not created"
                                    });
                                    db.close();
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    sociallogin1: function(data, callback) {
        data.os = "Android";
        data.num = 0;
        if (data.fbid) {
            var matchobj = {
                fbid: data.fbid,
                num: 0
            };
        } else {
            var matchobj = {
                googleid: data.googleid,
                num: 0
            };
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false",
                    comment: "Error"
                });
            } else if (db) {
                if (data.email) {
                    db.collection('user').find({
                        isreg: "false",
                        email: data.email
                    }).toArray(function(err, data3) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data3 && data3[0]) {
                            if (data3[0].deviceid && data3[0].deviceid.length > 0) {
                                var findIndex = data3[0].deviceid.indexOf(data.deviceid);
                                if (findIndex == -1) {
                                    data3[0].deviceid.push(data.deviceid);
                                }
                            } else {
                                data3[0].deviceid = [];
                                data3[0].deviceid.push(data.deviceid);
                            }
                            data.isreg = "true";
                            db.collection('user').update({
                                _id: sails.ObjectID(data3[0]._id)
                            }, {
                                $set: data
                            }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: "false"
                                    });
                                    db.close();
                                } else if (updated) {
                                    data._id = data3[0]._id;
                                    delete data.num;
                                    delete data.isreg;
                                    callback(data);
                                    db.close();
                                } else {
                                    console.log(err);
                                    callback({
                                        value: "false",
                                        comment: "Error"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            notmail();
                        }
                    });
                } else {
                    notmail();
                }

                function notmail() {
                    db.collection('user').find(matchobj).toArray(function(err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            if (data2[0].deviceid && data2[0].deviceid.length > 0) {
                                var findIndex = data2[0].deviceid.indexOf(data.deviceid);
                                if (findIndex == -1) {
                                    data2[0].deviceid.push(data.deviceid);
                                    data.deviceid = data2[0].deviceid;
                                } else {
                                    delete data.deviceid;
                                }
                            } else {
                                var device = data.deviceid;
                                data.deviceid = [];
                                data.deviceid.push(device);
                            }
                            if (data2[0].profilepic.indexOf("/") != -1) {
                                db.collection('user').update({
                                        _id: sails.ObjectID(data2[0]._id)
                                    }, {
                                        $set: data
                                    },
                                    function(err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                            db.close();
                                        } else if (updated) {
                                            data._id = data2[0]._id;
                                            delete data.num;
                                            delete data.isreg;
                                            callback(data);
                                            db.close();
                                        } else {
                                            callback({
                                                value: "false",
                                                comment: "No data found"
                                            });
                                            db.close();
                                        }
                                    });
                            } else if (data2[0].name != data.name || data2[0].email != data.email) {
                                delete data.profilepic;
                                db.collection('user').update({
                                        _id: sails.ObjectID(data2[0]._id)
                                    }, {
                                        $set: data
                                    },
                                    function(err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                            db.close();
                                        } else if (updated) {
                                            data._id = data2[0]._id;
                                            data.profilepic = data2[0].profilepic;
                                            delete data.num;
                                            delete data.isreg;
                                            callback(data);
                                            db.close();
                                        } else {
                                            callback({
                                                value: "false",
                                                comment: "No data found"
                                            });
                                            db.close();
                                        }
                                    });
                            } else {
                                db.collection('user').update({
                                        _id: sails.ObjectID(data2[0]._id)
                                    }, {
                                        $set: data
                                    },
                                    function(err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                            db.close();
                                        } else if (updated) {
                                            delete data2[0].num;
                                            delete data2[0].isreg;
                                            callback(data2[0]);
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
                        } else {
                            var device = data.deviceid;
                            data.deviceid = [];
                            data.deviceid.push(device);
                            data._id = sails.ObjectID();
                            db.collection('user').insert(data, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: "false"
                                    });
                                    db.close();
                                } else if (created) {
                                    delete data.num;
                                    callback(data);
                                    db.close();
                                } else {
                                    callback({
                                        value: "false",
                                        comment: "User not created"
                                    });
                                    db.close();
                                }
                            });
                        }
                    });
                }
            }
        });
    },
    findlimited: function(data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").count({
                    $or: [{
                        username: {
                            '$regex': check
                        }
                    }, {
                        email: {
                            '$regex': check
                        }
                    }]
                }, function(err, number) {
                    if (number) {
                        newreturns.total = number;
                        newreturns.totalpages = Math.ceil(number / data.pagesize);
                        callbackfunc();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: "false",
                            comment: "Error"
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
                    db.collection("user").find({
                        $or: [{
                            username: {
                                '$regex': check
                            }
                        }, {
                            email: {
                                '$regex': check
                            }
                        }]
                    }, {
                        num: 0
                    }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (err) {
                            console.log({
                                value: "false"
                            });
                            db.close();
                        } else if (found && found[0]) {
                            newreturns.data = found;
                            callback(newreturns);
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
    find: function(data, callback) {
        var returns = [];
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").find({}, {
                    num: 0
                }).toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
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
        var user = sails.ObjectID(data._id);
        var newreturn = {};
        var newcallback = 0;
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
                        "_id": user
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
                    if (err) {
                        console.log(err);
                        newreturn.note = 0;
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    } else {
                        if (result.length == 1) {
                            newreturn.note = result[0].count;
                        }
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    }
                });
                db.collection("user").aggregate([{
                    $match: {
                        "_id": user
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
                    if (err) {
                        console.log(err);
                        newreturn.folder = 0;
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    } else {
                        if (result.length == 1) {
                            newreturn.folder = result[0].count;
                        }
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }

                    }
                });
                db.collection("user").aggregate([{
                    $match: {
                        "_id": user
                    }
                }, {
                    $unwind: "$device"
                }, {
                    $match: {
                        "device.OS": {
                            $exists: "true"
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
                    if (err) {
                        console.log(err);
                        newreturn.device = 0;
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    } else {
                        if (result.length == 1) {
                            newreturn.device = result[0].count;
                        }
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }

                    }
                });
                db.collection("user").aggregate([{
                    $match: {
                        "_id": user
                    }
                }, {
                    $unwind: "$feed"
                }, {
                    $match: {
                        "feed.title": {
                            $exists: "true"
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
                    if (err) {
                        console.log(err);
                        newreturn.feed = 0;
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    } else {
                        if (result.length == 1) {
                            newreturn.feed = result[0].count;
                        }
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }

                    }
                });
                db.collection("user").aggregate([{
                    $match: {
                        "_id": user
                    }
                }, {
                    $unwind: "$share"
                }, {
                    $match: {
                        "share._id": {
                            $exists: "true"
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
                    if (err) {
                        console.log(err);
                        newreturn.share = 0;
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    } else {
                        if (result.length == 1) {
                            newreturn.share = result[0].count;
                        }
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }

                    }
                });
                db.collection("user").find({
                    "_id": user
                }, {
                    note: 0,
                    folder: 0,
                    device: 0,
                    feed: 0,
                    share: 0,
                    num: 0
                }).each(function(err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                    }
                    if (data != null) {
                        for (elem in data) {
                            newreturn[elem] = data[elem];
                        }
                        newcallback++;
                        if (newcallback == 6) {
                            callback(newreturn);
                        }
                    }
                });
            }
        });
    },
    findoneuser: function(data, callback) {
        var user = sails.ObjectID(data._id);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false",
                    comment: "Error"
                });
            } else if (db) {
                db.collection("user").find({
                    _id: user
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
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
    searchmail: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").find({
                    email: data.email
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback({
                            value: "true",
                            comment: "User found"
                        });
                        db.close();
                    } else {
                        callback({
                            value: "false",
                            comment: "No user found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            db.collection('user').remove({
                _id: sails.ObjectID(data._id)
            }, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: "true"
                    });
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
        });
    },
    deletealluser: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            db.collection('user').remove({}, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: "true"
                    });
                    db.close();
                } else if (err) {
                    db.collection("fs.files").remove(function(err, found) {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: "false",
                                comment: "Error"
                            });
                            db.close();
                        } else if (found && found[0]) {
                            db.collection("fs.chunks").remove(function(err, data2) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: "false"
                                    });
                                    db.close();
                                } else if (data2) {
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
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    countusers: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").count({}, function(err, number) {
                    if (number != null) {
                        callback(number);
                        db.close();
                    } else if (err) {
                        callback({
                            value: "false",
                            comment: "Error"
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
    countnotes: function(data, callback) {
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
                        "note.title": {
                            $exists: "true"
                        }
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
                        callback(result[0].count);
                        db.close();
                    } else if (!result[0]) {
                        callback(0);
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
    deleteupload: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                db.collection('fs.files').remove({
                    _id: sails.ObjectID(data._id)
                }, function(err, deleted) {
                    if (deleted) {
                        db.collection('fs.chunks').remove({
                            files_id: sails.ObjectID(data._id)
                        }, function(err, deleted) {
                            if (deleted) {
                                callback({
                                    value: "true"
                                });
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
    saveuser: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                data._id = sails.ObjectID();
                data.isreg = "false";
                db.collection('user').insert(data, function(err, created) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else if (created) {
                        callback({
                            value: "true",
                            _id: data._id
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
    },
    removemedia: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("fs.files").find({
                    filename: data.content
                }).toArray(function(err, found) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else if (found && found[0]) {
                        db.collection("fs.files").remove({
                            _id: sails.ObjectID(found[0]._id)
                        }, function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: "false"
                                });
                                db.close();
                            } else if (data2) {
                                db.collection("fs.chunks").remove({
                                    files_id: sails.ObjectID(found[0]._id)
                                }, function(err, data3) {
                                    if (err) {
                                        console.log(err);
                                        callback({
                                            value: "false",
                                            comment: "Error"
                                        });
                                    } else if (data3) {
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
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    logout: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false",
                    comment: "Error"
                });
            } else if (db) {
                db.collection('user').find({
                    _id: sails.ObjectID(data.user)
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        if (data2[0].deviceid && data2[0].deviceid[0]) {
                            var index = data2[0].deviceid.indexOf(data.deviceid);
                            if (index != -1) {
                                var newdata = {};
                                newdata.deviceid = [];
                                data2[0].deviceid.splice(index, 1);
                                newdata.deviceid = data2[0].deviceid;
                                db.collection('user').update({
                                    _id: sails.ObjectID(data.user),
                                }, {
                                    $set: newdata
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
                            } else {
                                callback({
                                    value: "true",
                                    comment: "Data updated"
                                });
                                db.close();
                            }
                        } else {
                            callback({
                                value: "true",
                                comment: "Data updated"
                            });
                            db.close();
                        }
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

    // save: function(data, callback) {
    //     if (data.password) {
    //         data.password = sails.md5(data.password);
    //     }
    //     sails.query(function(err, db) {
    //         if (err) {
    //             console.log(err);
    //             callback({
    //                 value: "false",
    //                 comment: "Error"
    //             });
    //         } else if (db) {
    //             if (!data._id) {
    //                 data._id = sails.ObjectID();
    //                 db.collection('user').find({
    //                     email: data.email
    //                 }).toArray(function(err, data2) {
    //                     if (err) {
    //                         console.log(err);
    //                         callback({
    //                             value: "false"
    //                         });
    //                         db.close();
    //                     } else if (data2 && data2[0]) {
    //                         callback({
    //                             value: "false",
    //                             comment: "User already exists"
    //                         });
    //                         db.close();
    //                     } else {
    //                         db.collection('user').insert(data, function(err, created) {
    //                             if (err) {
    //                                 console.log(err);
    //                                 callback({
    //                                     value: "false"
    //                                 });
    //                                 db.close();
    //                             } else if (created) {
    //                                 delete data.password;
    //                                 callback(data);
    //                                 db.close();
    //                             } else {
    //                                 callback({
    //                                     value: "false",
    //                                     comment: "No data found"
    //                                 });
    //                                 db.close();
    //                             }
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 var user = sails.ObjectID(data._id);
    //                 delete data._id;
    //                 db.collection('user').update({
    //                     _id: user
    //                 }, {
    //                     $set: data
    //                 }, function(err, updated) {
    //                     if (err) {
    //                         console.log(err);
    //                         callback({
    //                             value: "false"
    //                         });
    //                         db.close();
    //                     } else if (updated.result.nModified != 0 && updated.result.n != 0) {
    //                         callback({
    //                             value: "true"
    //                         });
    //                         db.close();
    //                     } else if (updated.result.nModified == 0 && updated.result.n != 0) {
    //                         callback({
    //                             value: "true",
    //                             comment: "Data already updated"
    //                         });
    //                         db.close();
    //                     } else {
    //                         callback({
    //                             value: "false",
    //                             comment: "No data found"
    //                         });
    //                         db.close();
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // },
    // login: function(data, callback) {
    //     var exitup = 0;
    //     var exit = 0;
    //     var exitdown = 0;
    //     if (data.password) {
    //         data.password = sails.md5(data.password);
    //     }
    //     sails.query(function(err, db) {
    //         if (err) {
    //             console.log(err);
    //             callback({
    //                 value: "false"
    //             });
    //         } else if (db) {
    //             if (data.email && data.email != "" && data.password && data.password != "") {
    //                 db.collection('user').find({
    //                     email: data.email,
    //                     password: data.password
    //                 }, {
    //                     password: 0,
    //                     forgotpassword: 0
    //                 }).each(function(err, found) {
    //                     exitup++;
    //                     if (err) {
    //                         callback({
    //                             value: "false"
    //                         });
    //                         console.log(err);
    //                     } else if (found != null) {
    //                         if (found && found.forgotpassword) {
    //                             db.collection('user').update({
    //                                 email: data.email,
    //                                 password: data.password
    //                             }, {
    //                                 $set: {
    //                                     forgotpassword: ""
    //                                 }
    //                             }, function(err, updated) {
    //                                 if (err) {
    //                                     console.log(err);
    //                                     callback({
    //                                         value: "false"
    //                                     });
    //                                 } else if (updated) {
    //                                     console.log("updated");
    //                                 }
    //                             });
    //                         }
    //                         callback(found);
    //                     } else {
    //                         db.collection('user').find({
    //                             email: data.email,
    //                             forgotpassword: data.password
    //                         }, {
    //                             password: 0,
    //                             forgotpassword: 0
    //                         }).each(function(err, found) {
    //                             exit++;
    //                             if (err) {
    //                                 callback({
    //                                     value: "false"
    //                                 });
    //                                 console.log(err);
    //                             } else if (found != null) {
    //                                 sails.ObjectID(data._id);
    //                                 db.collection('user').update({
    //                                     email: data.email
    //                                 }, {
    //                                     $set: {
    //                                         forgotpassword: "",
    //                                         password: data.password
    //                                     }
    //                                 }, function(err, updated) {
    //                                     if (err) {
    //                                         console.log(err);
    //                                         callback({
    //                                             value: "false"
    //                                         });
    //                                     } else if (updated) {
    //                                         console.log("updated");
    //                                     }
    //                                 });
    //                                 callback(found);
    //                             } else {
    //                                 exitdown++;
    //                                 if (exit == exitup == exitdown) {
    //                                     callback({
    //                                         value: "false",
    //                                         comment: "Email-id and Password Incorrect"
    //                                     });
    //                                 }
    //                             }
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 callback({
    //                     value: "false",
    //                     comment: "Please provide emailid and password"
    //                 });
    //                 db.close();
    //             }
    //         }
    //     });
    // },
    // changepassword: function(data, callback) {
    //     if (data.password && data.password != "" && data.editpassword && data.editpassword != "" && data.email && data.email != "") {
    //         data.password = sails.md5(data.password);
    //         var user = sails.ObjectID(data._id);
    //         var newpass = sails.md5(data.editpassword);
    //         sails.query(function(err, db) {
    //             if (err) {
    //                 console.log(err);
    //                 callback({
    //                     value: "false"
    //                 });
    //             } else if (db) {
    //                 db.collection('user').update({
    //                     "_id": user,
    //                     "email": data.email,
    //                     "password": data.password
    //                 }, {
    //                     $set: {
    //                         "password": newpass
    //                     }
    //                 }, function(err, updated) {
    //                     if (err) {
    //                         console.log(err);
    //                         callback({
    //                             value: "false"
    //                         });
    //                         db.close();
    //                     } else if (updated.result.nModified == 1 && updated.result.n == 1) {
    //                         callback({
    //                             value: "true"
    //                         });
    //                         db.close();
    //                     } else if (updated.result.nModified != 1 && updated.result.n == 1) {
    //                         callback({
    //                             value: "false",
    //                             comment: "Same password. Please try different password"
    //                         });
    //                         db.close();
    //                     } else {
    //                         callback({
    //                             value: "false",
    //                             comment: "No data found"
    //                         });
    //                         db.close();
    //                     }
    //                 });
    //             }
    //         });
    //     } else {
    //         callback({
    //             value: "false",
    //             comment: "Please provide all parameters"
    //         });
    //     }
    // },
    // forgotpassword: function(data, callback) {
    //     sails.query(function(err, db) {
    //         db.collection('user').find({
    //             email: data.email
    //         }).toArray(function(err, data2) {
    //             if (err) {
    //                 console.log(err);
    //                 callback({
    //                     value: "false"
    //                 });
    //                 db.close();
    //             } else if (data2 && data2[0]) {
    //                 var text = "";
    //                 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //                 for (var i = 0; i < 8; i++) {
    //                     text += possible.charAt(Math.floor(Math.random() * possible.length));
    //                 }
    //                 var encrypttext = sails.md5(text);
    //                 sails.query(function(err, db) {
    //                     var user = sails.ObjectID(data._id);
    //                     db.collection('user').update({
    //                         email: data.email
    //                     }, {
    //                         $set: {
    //                             forgotpassword: encrypttext
    //                         }
    //                     }, function(err, updated) {
    //                         if (err) {
    //                             console.log(err);
    //                             callback({
    //                                 value: "false"
    //                             });
    //                             db.close();
    //                         } else if (updated) {
    //                             var template_name = "noteshare";
    //                             var template_content = [{
    //                                 "name": "noteshare",
    //                                 "content": "noteshare"
    //                             }]
    //                             var message = {
    //                                 "from_email": sails.fromEmail,
    //                                 "from_name": sails.fromName,
    //                                 "to": [{
    //                                     "email": data.email,
    //                                     "type": "to"
    //                                 }],
    //                                 "global_merge_vars": [{
    //                                     "name": "password",
    //                                     "content": text
    //                                 }]
    //                             };
    //                             sails.mandrill_client.messages.sendTemplate({
    //                                 "template_name": template_name,
    //                                 "template_content": template_content,
    //                                 "message": message
    //                             }, function(result) {
    //                                 callback({
    //                                     value: "true",
    //                                     comment: "Mail Sent"
    //                                 });
    //                                 db.close();
    //                             }, function(e) {
    //                                 callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    //                             });
    //                         } else {
    //                             callback({
    //                                 value: "false",
    //                                 comment: "No data found"
    //                             });
    //                             db.close();
    //                         }
    //                     });
    //                 });
    //             } else {
    //                 callback({
    //                     value: "false",
    //                     comment: "No data found"
    //                 });
    //                 db.close();
    //             }
    //         });
    //     });
    // },
};
