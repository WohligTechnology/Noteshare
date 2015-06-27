/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.find(req.body, print);
    },findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.delete(req.body, print);
    }
};