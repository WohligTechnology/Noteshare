/**
 * FolderController
 *
 * @description :: Server-side logic for managing folders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.find(req.body, callback);

    },
    findOne: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.findone(req.body, callback);
    },
    localtoserver: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.localtoserver(req.body, callback);
    },
    servertolocal: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Folder.servertolocal(req.body, callback);
    }
};