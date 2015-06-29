/**
 * Share.js
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
                            share: data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            console.log(updated);
                            callback({
                                value: true
                            });
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
                        "share._id": sails.ObjectID(data._id)
                    }, {
                        $set: {
                            "share.$": data
                        }
                    }, function (err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (updated) {
                            console.log(updated);
                            callback({
                                value: true
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
                        "share": {
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
                        console.log(updated);
                        callback({
                            value: true
                        });
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
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": user,
                    "share._id": sails.ObjectID(data._id)
                }, {
                    "share.$": 1
                }).each(function (err, data2) {
                    if (data2 != null) {
                        callback(data2.share[0]);
                        console.log("share findone");
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
                        callback(data.share);
                        console.log("share find");
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