/**
 * NoteController
 *
 * @description :: Server-side logic for managing Note
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.find(req.body, callback);

    },
    findone: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.findone(req.body, callback);
    }
};