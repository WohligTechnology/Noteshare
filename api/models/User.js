/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (str, callback) {
        if (!str._id) {
            str._id = sails.ObjectID();
            sails.query(function (err, db) {
                var cuser = db.collection('user').insert(str, function (err, created) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (created) {
                        console.log(created);
                        callback({
                            value: true
                        });
                    }
                });
            });
        } else {
            sails.query(function (err, db) {
                var cuser = db.collection('user').update({
                    _id: str.id
                }, {
                    $set: str
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
            });
        }
    },
    find: function (str, callback) {
        returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({}, {
                    "name": 1
                }).each(function (err, data) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (data != null) {
                        returns.push(data);
                    } else {
                        console.log(returns);
                        callback(returns);
                    }
                });
            }
        });
    },
    findone: function (str, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    "_id": sails.ObjectID(str.id)
                }, {
                    "name": 1
                }).each(function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data != null) {
                        console.log(data);
                        callback(data);
                    }
                });
            }
        });
    },
    delete: function (str, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            var cuser = db.collection('user').remove({
                _id: sails.ObjectID(str.id)
            }, function (err, deleted) {
                if (deleted) {
                    console.log(deleted);
                    callback({
                        value: true
                    });
                }
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
            });
        });
    }
};