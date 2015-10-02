/**
 * ShareController
 *
 * @description :: Server-side logic for managing Share
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                share();
            } else {
                res.json({
                    value: "false",
                    comment: "Share-id is incorrect"
                });
            }
        } else {
            share();
        }

        function share() {
            var print = function(data) {
                res.json(data);
            }
            Share.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Share.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Share-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Share.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Share.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Share-id is incorrect"
            });
        }
    }
};