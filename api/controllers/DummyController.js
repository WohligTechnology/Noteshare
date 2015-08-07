/**
 * DummyController
 *
 * @description :: Server-side logic for managing dummies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var lwip = require('lwip');
module.exports = {
    gridfs: function(req, res) {
        sails.MongoClient.connect("mongodb://localhost:27017/dummy", function(err, db) {
            if (err) {
                console.log(err);
            }
            req.file("file").upload({
                maxBytes: 10000000000000
            }, function(err, uploadedFiles) {
                if (err) {
                    return res.send(500, err);
                }
                _.each(uploadedFiles, function(n) {
                    var filepath = n.fd
                    db.open(function(err, db) {
                        var fileId = new sails.ObjectID();
                        var gridStore = new sails.GridStore(db, fileId, 'w');
                        gridStore.open(function(err, gridStore) {
                            gridStore.writeFile(filepath, function(err, doc) {
                                sails.GridStore.read(db, fileId, function(err, fileData) {
                                    console.log(fileId);
                                    res.json(fileId);
                                    sails.fs.unlink(filepath, function(err) {
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
    getimage: function(req, res) {
        sails.MongoClient.connect("mongodb://localhost:27017/dummy", function(err, db) {
            if (err) {
                console.log(err);
            }
            var filename = req.query.file;
            var fileId = sails.ObjectID(filename);
            var file = new sails.GridStore(db, fileId, "r");
            file.open(function(err, file) {
                if (err) {
                    console.log(err);
                }
                res.set('Content-Type', 'image');
                var stream = file.stream();
                stream.pipe(res);
            });
        });
    },
    upload: function(req, res) {
        req.file('file').upload({
            maxBytes: 10000000000000,
            adapter: require('skipper-gridfs'),
            uri: 'mongodb://localhost:27017/dummy.fs'
        }, function(err, files) {
            if (err) {
                return res.serverError(err);
            }
            if (files) {
                return res.json({
                    message: files.length + ' file(s) uploaded successfully!',
                    files: files
                });
            }
        });
    },
    resize: function(req, res) {
        var skipper = require('skipper-gridfs')({
            uri: 'mongodb://localhost:27017/dummy.fs'
        });
        var fd = req.param('file');
        var newheight = req.param('height');
        var newwidth = req.param('width');
        if (!newwidth && !newheight) {
            showimage(fd);
        } else if (!newwidth && newheight) {
            newheight = parseInt(newheight);
            newimage(fd, 0, newheight);
        } else if (newwidth && !newheight) {
            newwidth = parseInt(newwidth);
            newimage(fd, newwidth, 0);
        } else {
            newimage(fd, newwidth, newheight);
        }

        function newimage(fd, newwidth, newheight) {
            skipper.read(fd, function(error, file) {
                if (file) {
                    var newdate = sails.moment(new Date()).format('YYYY-MM-DDh-mm-ss-SSSSa');
                    var filepath = './uploads/image' + newdate + '.jpg';
                    sails.fs.writeFile(filepath, file, function(err) {
                        if (err) {
                            console.log(err);
                            res.json("false");
                        }
                        resize(filepath, newwidth, newheight);
                    });
                }
            });
        }

        function resize(newfilepath, width, height) {
            var unlinkpath = newfilepath;
            width = parseInt(width);
            height = parseInt(height);
            newfilenamearr = newfilepath.split(".");
            extension = newfilenamearr.pop();
            var indexno = newfilepath.search("." + extension);
            var newfilestart = newfilepath.substr(0, indexno);
            var newfileend = newfilepath.substr(indexno, newfilepath.length);
            lwip.open(newfilepath, function(err, image) {
                var dimensions = {};
                dimensions.width = image.width();
                dimensions.height = image.height();
                if (width == 0) {
                    width = dimensions.width / dimensions.height * height;
                }
                if (height == 0) {
                    height = dimensions.height / dimensions.width * width;
                }
                if (err) {
                    console.log(err);
                }
                image.resize(width, height, "lanczos", function(err, image) {
                    image.toBuffer(extension, function(err, buffer) {
                        sails.fs.writeFileSync(newfilename, buffer);
                        upload(newfilename, unlinkpath);
                    });

                });

            });
        }

        function upload(filepath, unlinkpath) {
            var file = filepath;
            req.file('file').upload({
                maxBytes: 10000000000000,
                adapter: require('skipper-gridfs'),
                uri: 'mongodb://localhost:27017/dummy.fs'
            }, function(err, files) {
                if (err) {
                    return res.serverError(err);
                }
                if (files) {
                    sails.fs.unlink(unlinkpath, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return res.json({
                        message: files.length + ' file(s) uploaded successfully!',
                        files: files
                    });
                    showimage(files[0].fd);
                }
            });
        }

        function showimage(oldfile) {
            sails.MongoClient.connect("mongodb://localhost:27017/dummy", function(err, db) {
                if (err) {
                    console.log(err);
                }
                var filename = oldfile;
                var file = new sails.GridStore(db, filename, "r");
                file.open(function(err, file) {
                    if (err) {
                        console.log(err);
                    }
                    res.set('Content-Type', 'image');
                    var stream = file.stream();
                    stream.pipe(res);
                });
            });
        }
    }
};