/**
 * NoteController
 *
 * @description :: Server-side logic for managing Notes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
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
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    delete: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
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
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    find: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                function callback(data) {
                    res.json(data);
                };
                Note.find(req.body, callback);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findone: function(req, res) {
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
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
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findbyid: function(req, res) {
        if (req.body) {
            if (req.body.note && req.body.note != "" && sails.ObjectID.isValid(req.body.note)) {
                var print = function(data) {
                    res.json(data);
                }
                Note.findbyid(req.body, print);
            } else {
                res.json({
                    value: "false",
                    comment: "Note-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findlimited: function(req, res) {
        if (req.body) {
            if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.paenumber != "") {
                function callback(data) {
                    res.json(data);
                };
                Note.findlimited(req.body, callback);
            } else {
                res.json({
                    value: "false",
                    comment: "Please provide parameters"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
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
        if (req.body) {
            if (req.body.user && req.body.user != "" && sails.ObjectID.isValid(req.body.user)) {
                function callback(data) {
                    res.json(data);
                };
                Note.servertolocal(req.body, callback);
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    timebomb: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.timebomb(req.body, callback);
    },
    deletemedia: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Note.deletemedia(req.body, callback);
    },
    get: function(req,res) {
        res.view("index");
    },
    getUrl: function(req,res) {
        res.view("index2");
    }
};
