/**
 * DeviceController
 *
 * @description :: Server-side logic for managing Device
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Device.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Device.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Device.find(req.body, callback);

    },
    findone: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Device.findone(req.body, callback);
    }
};