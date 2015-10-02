/**
 * NoteController
 *
 * @description :: Server-side logic for managing Note
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                note();
            } else {
                res.json({
                    value: "false",
                    comment: "Note-id is incorrect"
                });
            }
        } else {
            note();
        }

        function note() {
            var print = function(data) {
                res.json(data);
            }
            Note.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Note.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Note-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.find(req.body, callback);
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.findlimited(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Note.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Note-id is incorrect"
            });
        }
    },
    localtoserver: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.localtoserver(req.body, callback);
    },
    servertolocal: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.servertolocal(req.body, callback);
    },
    timebomb: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.timebomb(req.body, callback);
    }
};