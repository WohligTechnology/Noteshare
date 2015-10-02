/**
 * FolderController
 *
 * @description :: Server-side logic for managing folders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                folder();
            } else {
                res.json({
                    value: "false",
                    comment: "Folder-id is incorrect"
                });
            }
        } else {
            folder();
        }

        function folder() {
            var print = function(data) {
                res.json(data);
            }
            Folder.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Folder.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Folder-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Folder.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Folder-id is incorrect"
            });
        }
    },
    localtoserver: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.localtoserver(req.body, callback);
    },
    servertolocal: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.servertolocal(req.body, callback);
    }
};