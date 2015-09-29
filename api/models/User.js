/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var md5 = require('MD5');
var mandrill = require('mandrill-api/mandrill');
mandrill_client = new mandrill.Mandrill('dzbY2mySNE_Zsqr3hsK70A');
module.exports = {
    save: function (data, callback) {
        if (data.password) {
            data.password = md5(data.password);
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                if (!data._id && data.email && data.email != "") {
                    db.collection("user").find({
                        email: data.email,
                        isreg: "true"
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            if (data2[0].isreg == "true") {
                                callback({
                                    value: "false",
                                    comment: "User already exists"
                                });
                                db.close();
                            } else if (data2[0].isreg == "false") {
                                data._id = data2[0]._id;
                                data.isreg = "true";
                                edituser();
                            } else {
                                callback({
                                    value: "false",
                                    comment: "User to be deleted"
                                });
                                db.close();
                            }
                        } else {
                            createuser();
                        }
                    });
                } else if (data._id && data._id != "") {
                    edituser();
                } else {
                    callback({
                        value: "false",
                        comment: "Please provide proper data"
                    });
                    db.close();
                }

                function createuser() {
                    data._id = sails.ObjectID();
                    data.isreg = "true";
                    db.collection('user').insert(data, function (err, created) {
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
                                comment: "User Not created"
                            });
                            db.close();
                        }
                    });
                }

                function edituser() {
                    var user = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('user').update({
                        _id: user
                    }, {
                        $set: data
                    }, function (err, updated) {
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
                                comment: "No such user found"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    findlimited: function (data, callback) {
        var newcallback = 0;
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        sails.query(function (err, db) {
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
                }, function (err, number) {
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
                        password: 0,
                        forgotpassword: 0
                    }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
    find: function (data, callback) {
        var returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").find({}, {
                    password: 0,
                    forgotpassword: 0
                }).toArray(function (err, found) {
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
                            comment: "No User found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findone: function (data, callback) {
        var user = sails.ObjectID(data._id)
        var newreturn = {};
        var newcallback = 0;
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            "_id": user
                        }
                    },
                    {
                        $unwind: "$note"
                    },
                    {
                        $match: {
                            "note.title": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                db.collection("user").aggregate([
                    {
                        $match: {
                            "_id": user
                        }
                    },
                    {
                        $unwind: "$folder"
                    },
                    {
                        $match: {
                            "folder.name": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                db.collection("user").aggregate([
                    {
                        $match: {
                            "_id": user
                        }
                    },
                    {
                        $unwind: "$device"
                    },
                    {
                        $match: {
                            "device.OS": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                db.collection("user").aggregate([
                    {
                        $match: {
                            "_id": user
                        }
                    },
                    {
                        $unwind: "$feed"
                    },
                    {
                        $match: {
                            "feed.title": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                db.collection("user").aggregate([
                    {
                        $match: {
                            "_id": user
                        }
                    },
                    {
                        $unwind: "$share"
                    },
                    {
                        $match: {
                            "share._id": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                    password: 0
                }).each(function (err, data) {
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
    findoneuser: function (data, callback) {
        var user = sails.ObjectID(data._id);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false",
                    comment: "Error"
                });
            } else if (db) {
                db.collection("user").find({
                    _id: user
                }).toArray(function (err, data2) {
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
                            comment: "No user found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    searchmail: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").find({
                    email: data.email
                }).toArray(function (err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: "false"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback({
                            value: "true"
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
    delete: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            db.collection('user').remove({
                _id: sails.ObjectID(data._id)
            }, function (err, deleted) {
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
                        comment: "Not deleted"
                    });
                    db.close();
                }
            });
        });
    },
    deletealluser: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            db.collection('user').remove({}, function (err, deleted) {
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
                        comment: "Not deleted"
                    });
                    db.close();
                }
            });
        });
    },
    login: function (data, callback) {
        var exitup = 0;
        var exit = 0;
        var exitdown = 0;
        if (data.password) {
            data.password = md5(data.password);
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                if (data.email && data.email != "" && data.password && data.password != "") {
                    db.collection('user').find({
                        email: data.email,
                        password: data.password
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).each(function (err, found) {
                        exitup++;
                        if (err) {
                            callback({
                                value: "false"
                            });
                            console.log(err);
                        } else if (found != null) {
                            if (found && found.forgotpassword) {
                                db.collection('user').update({
                                    email: data.email,
                                    password: data.password
                                }, {
                                    $set: {
                                        forgotpassword: ""
                                    }
                                }, function (err, updated) {
                                    if (err) {
                                        console.log(err);
                                        callback({
                                            value: "false"
                                        });
                                    } else if (updated) {
                                        console.log("updated");
                                    }
                                });
                            }
                            callback(found);
                        } else {
                            db.collection('user').find({
                                email: data.email,
                                forgotpassword: data.password
                            }, {
                                password: 0,
                                forgotpassword: 0
                            }).each(function (err, found) {
                                exit++;
                                if (err) {
                                    callback({
                                        value: "false"
                                    });
                                    console.log(err);
                                } else if (found != null) {
                                    sails.ObjectID(data._id);
                                    db.collection('user').update({
                                        email: data.email
                                    }, {
                                        $set: {
                                            forgotpassword: "",
                                            password: data.password
                                        }
                                    }, function (err, updated) {
                                        if (err) {
                                            console.log(err);
                                            callback({
                                                value: "false"
                                            });
                                        } else if (updated) {
                                            console.log("updated");
                                        }
                                    });
                                    callback(found);
                                } else {
                                    exitdown++;
                                    if (exit == exitup == exitdown) {
                                        callback({
                                            value: "false",
                                            comment: "Email and Password Incorrect"
                                        });
                                    }
                                }
                            });
                        }
                    });
                } else if (data.fbid && data.fbid != "") {
                    db.collection("user").find({
                        "fbid": data.fbid
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            callback(data2[0]);
                            db.close();
                        } else {
                            callback({
                                value: "false",
                                comment: "User not found"
                            });
                            db.close();
                        }
                    });
                } else if (data.googleid && data.googleid != "") {
                    db.collection("user").find({
                        "googleid": data.googleid
                    }).toArray(function (err, data2) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (data2 && data2[0]) {
                            callback(data2[0]);
                            db.close();
                        } else {
                            callback({
                                value: "false",
                                comment: "User not found"
                            });
                            db.close();
                        }
                    });
                } else {
                    callback({
                        value: "false",
                        comment: "Please provide fbid or googleid or email and password"
                    });
                    db.close();
                }
            }
        });
    },
    changepassword: function (data, callback) {
        data.password = md5(data.password);
        var user = sails.ObjectID(data._id);
        var newpass = md5(data.editpassword);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                if (data.editpassword == "") {
                    callback({
                        value: "false",
                        comment: "Edit password cannot be empty"
                    });
                } else {
                    db.collection('user').update({
                        "_id": user,
                        "email": data.email,
                        "password": data.password
                    }, {
                        $set: {
                            "password": newpass
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: "false"
                            });
                            db.close();
                        } else if (updated) {
                            if (updated.result.nModified == 1) {
                                callback({
                                    value: "true"
                                });
                                db.close();
                            } else {
                                callback({
                                    value: "true"
                                });
                                db.close();
                            }
                        } else {
                            callback({
                                value: "false",
                                comment: "Not edited"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    forgotpassword: function (data, callback) {
        sails.query(function (err, db) {
            db.collection('user').find({
                email: data.email
            }).toArray(function (err, data2) {
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
                    });
                    db.close();
                } else if (data2 && data2[0]) {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    for (var i = 0; i < 8; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    var encrypttext = md5(text);
                    sails.query(function (err, db) {
                        var user = sails.ObjectID(data._id);
                        db.collection('user').update({
                            email: data.email
                        }, {
                            $set: {
                                forgotpassword: encrypttext
                            }
                        }, function (err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: "false"
                                });
                                db.close();
                            } else if (updated) {
                                var template_name = "Noteshare";
                                var template_content = [{
                                    "name": "noteshare",
                                    "content": "noteshare"
                                    }]
                                var message = {
                                    "from_email": "vigneshkasthuri2009@gmail.com",
                                    "from_name": "Wohlig",
                                    "to": [{
                                        "email": data.email,
                                        "type": "to"
                                    }],
                                    "global_merge_vars": [
                                        {
                                            "name": "password",
                                            "content": text
                                        }]
                                };
                                mandrill_client.messages.sendTemplate({
                                    "template_name": template_name,
                                    "template_content": template_content,
                                    "message": message
                                }, function (result) {
                                    callback({
                                        value: "true",
                                        comment: "Mail Sent"
                                    });
                                    db.close();
                                }, function (e) {
                                    callback('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                });
                            } else {
                                callback({
                                    value: "false",
                                    comment: "No updated"
                                });
                                db.close();
                            }
                        });
                    });
                } else {
                    callback({
                        value: "false",
                        comment: "No user found"
                    });
                    db.close();
                }
            });
        });
    },
    countusers: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").count({}, function (err, number) {
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
                            comment: "Not found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    countnotes: function (data, callback) {
        var user = sails.ObjectID(data.user);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").aggregate([
                    {
                        $match: {
                            "note.title": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $unwind: "$note"
                    },
                    {
                        $match: {
                            "note.title": {
                                $exists: "true"
                            }
                        }
                    },
                    {
                        $group: {
                            _id: user,
                            count: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $project: {
                            count: 1
                        }
                    }
                ]).toArray(function (err, result) {
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
                            comment: "No count"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    deleteupload: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                db.collection('fs.files').remove({
                    _id: sails.ObjectID(data._id)
                }, function (err, deleted) {
                    if (deleted) {
                        db.collection('fs.chunks').remove({
                            files_id: sails.ObjectID(data._id)
                        }, function (err, deleted) {
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
                                    comment: "No Such Data"
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
                            comment: "No Such Data"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    saveuser: function (data, callback) {
        if (data.password) {
            data.password = md5(data.password);
        }
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            } else if (db) {
                data._id = sails.ObjectID();
                data.isreg = "false";
                db.collection('user').insert(data, function (err, created) {
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
                            comment: "User Not created"
                        });
                        db.close();
                    }
                });
            }
        });
    }
};