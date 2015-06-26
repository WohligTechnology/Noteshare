/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Users.create(req.body, print);
    },
    finduser: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Users.finduser(req.body, print);
    }
};