/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    save: function (str, callback) {
        returns = [];
        if (!str._id) {
            str._id = sails.ObjectID();
            sails.query(function (err, db) {
                var cuser = db.collection('users').insert(str, function (err, created) {
                    if (created) {
                        console.log(userid);
                        callback("true");
                    }
                });
            });
        } else {
            sails.query(function (err, db) {
                var cuser = db.collection('users').update({
                    _id: str.id
                }, {
                    $set: str
                }, function (err, updated) {
                    if (updated) {
                        console.log(userid);
                        callback("true");
                    }
                });
            });
        }
    },
    finduser: function (str, callback) {
        returns = [];
        sails.query(function (err, db) {
            var finduser = db.collection('users').find({name:str.name}).each(function (err, data) {
                if (data != null) {
                    returns.push(data);
                } else {
                    callback(returns);
                }
            });
        });
    },
    deleteuser: function (str, callback) {
        returns=[];
        sails.query(function (err,db){
            
        });
    }
};