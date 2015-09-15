/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    uploadfile: function (req, res) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            }
            req.file("file").upload({
                maxBytes: 100000000
            }, function (err, uploadedFiles) {
                if (err) {
                    return res.send(500, err);
                }
                _.each(uploadedFiles, function (n) {
                    var filepath = n.fd;
                    var newfilepath = n.fd;
                    var newfilenamearr = newfilepath.split(".");
                    var extension = newfilenamearr.pop();
                    var mimetype = sails.mime.lookup(n.fd);
                    var newdate = sails.moment(new Date()).format('YYYY-MM-DDh-mm-ss-SSSSa');
                    var filename = 'image' + newdate + '.' + extension;
                    db.open(function (err, db) {
                        var fileId = new sails.ObjectID();
                        var gridStore = new sails.GridStore(db, fileId, filename, 'w', {
                            content_type: mimetype
                        });
                        gridStore.open(function (err, gridStore) {
                            gridStore.writeFile(filepath, function (err, doc) {
                                sails.GridStore.read(db, fileId, function (err, fileData) {
                                    var buffr = fileData;
                                    res.json({fileid:fileId});
                                    db.close();
                                    sails.fs.unlink(filepath, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    getupload: function (req, res) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            } else if (db) {
                var filename = req.query.file;
                var fileId = sails.ObjectID(filename);
                var file = new sails.GridStore(db, fileId, "r");
                file.open(function (err, file) {
                    if (err) {
                        console.log(err);
                        db.close();
                    } else if (file) {
                        res.set('Content-Type', file.contentType);
                        var stream = file.stream();
                        stream.pipe(res);
                        file.close();
                    }
                });
            }
        });
    },
    deleteupload: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.deleteupload(req.body, print);
    },
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
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findone(req.body, print);
    },
    searchmail: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.searchmail(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.delete(req.body, print);
    },
    login: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.login(req.body, print);
    },
    changepassword: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.changepassword(req.body, print);
    },
    forgotpassword: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.forgotpassword(req.body, print);
    },
    countusers: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.countusers(req.body, print);
    },
    countnotes: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.countnotes(req.body, print);
    }
};