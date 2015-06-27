/**
 * ShareController
 *
 * @description :: Server-side logic for managing Share
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Share.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Share.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Share.find(req.body, callback);

    },
    findone: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Share.findone(req.body, callback);
    }
};