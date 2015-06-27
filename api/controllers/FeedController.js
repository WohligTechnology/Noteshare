/**
 * FeedController
 *
 * @description :: Server-side logic for managing Feed
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Feed.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Feed.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Feed.find(req.body, callback);

    },
    findone: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Feed.findone(req.body, callback);
    }
};