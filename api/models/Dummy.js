/**
 * Dummy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
//var lwip = require('lwip');
var imagedata = '';
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
            sails.lwip.create(900, 600, 'white', function (err, canvas) {
                canvasdata = canvas;
                _.each(data.image, function (n) {
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
                                        console.log(fileData);
//                                        sails.lwip.open(fileData, 'jpg', function (err, imagefile) {
//                                            newimagedata = imagefile;
//                                            console.log(newimagedata);
//                                            canvasdata.paste(n.left, n.top, newimagedata, function (err, newimage) {
//                                                imagedata = newimage;
//                                                canvasdata = newimage;
//                                                i++;
//                                                if (i == data.image.length) {
//                                                    uploadimage();
//                                                }
//                                            });
//                                        });
                                    });
                                }
                            }
                        });
                    }
                });

                function uploadimage() {
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