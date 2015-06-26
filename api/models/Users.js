/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    create: function (str, callback) {
        returns = [];
        var userid = sails.ObjectID();
        sails.MongoClient.connect(sails.url, function (err, db) {
            var cuser = db.collection('users').insert({
                _id: userid
            }, str, function (err, created) {
                if (created) {
                    console.log(userid);
                    var uusercreate = db.collection('users').update({
                        _id: userid
                    }, {
                        $set: str
                    }, function (err, updated) {
                        if (updated) {
                            console.log("true");
                        }
                    });
                }
            });
        });
    }
};