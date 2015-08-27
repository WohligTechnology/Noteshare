/**
 * Dummy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
//var lwip = require('lwip');
var imagedata = '';
var type = '';
var filetype = '';
var newimagedata = '';
var canvasdata = '';
var i = 0;
module.exports = {
    find: function (data, callback) {
        var returns = [];
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("fs.files").find({}, {}).each(function (err, found) {
                    if (err) {
                        console.log({
                            value: false
                        });
                    }
                    if (found != null) {
                        returns.push(found);
                    } else {
                        if (found == null) {
                            callback(returns);
                        }
                    }
                });
            }
        });
    },
    remove: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("fs.files").remove({}, function (err, data) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                    }
                    if (data) {
                        db.collection("fs.chunks").remove({}, function (err, data) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                            if (data) {
                                callback({
                                    value: true
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    findeach: function (data, callback) {
        sails.query(function (err, db) {
            var returns = data;
            sails.lwip.create(1024, 768, 'white', function (err, canvas) {
                canvasdata = canvas;

                function recimage(num) {
                    n = data.image[num];
                    console.log("n");
                    console.log(n);
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        db.collection('image').find({
                            "id": n.id
                        }).toArray(function (err, image) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                            if (image && image != null) {
                                var fd = sails.ObjectID(image[0].imagefs);
                                if (fd && fd != null) {

                                    sails.GridStore.read(db, fd, function (err, fileData) {
                                        var file = new sails.GridStore(db, fd, "r");
                                        file.open(function (err, file) {
                                            if (file) {
                                                filetype = file.contentType;
                                                if (filetype == 'image/jpeg') {
                                                    type = 'jpg';
                                                } else if (filetype == 'image/png') {
                                                    type = 'png';
                                                } else if (filetype == 'image/gif') {
                                                    type = 'gif';
                                                }
                                                imagecreate();
                                            }
                                        });

                                        function imagecreate() {
                                            if (type != '') {
                                                if (canvasdata != "") {
                                                    sails.lwip.open(fileData, type, function (err, imagefile) {
                                                        if (imagefile) {
                                                            newimagedata = imagefile;
                                                            canvasdata.paste(n.left, n.top, newimagedata, function (err, newimage) {
                                                                num++;
                                                                canvasdata = newimage;
                                                                if (newimage) {
                                                                    if (num == data.image.length) {
                                                                        uploadimage(newimage);
                                                                    } else {
                                                                        recimage(data.image, num);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }

                recimage(0);

                function uploadimage(imagedata) {
                    var fileId = new sails.ObjectID();
                    var mimetype = 'image/jpeg';
                    var gridStore = new sails.GridStore(db, fileId, 'w', {
                        content_type: mimetype
                    });
                    gridStore.open(function (err, gridStore) {
                        if (err) {
                            console.log(err);
                        }
                        imagedata.toBuffer('jpg', {}, function (err, imagebuf) {
                            gridStore.write(imagebuf, function (err, doc) {
                                if (err) {
                                    console.log(err);
                                }
                                if (doc) {
                                    gridStore.close(function () {
                                        console.log(fileId);
                                    });
                                }
                            });
                        });
                    });
                }
            });
        });
    }
};