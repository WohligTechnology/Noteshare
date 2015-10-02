/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                device();
            } else {
                res.json({
                    value: "false",
                    comment: "Device-id is incorrect"
                });
            }
        } else {
            device();
        }

        function device() {
            var print = function(data) {
                res.json(data);
            }
            Device.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Device.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Device-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Device.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Device.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Device-id is incorrect"
            });
        }
    }
};