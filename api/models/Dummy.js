/**
 * Dummy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var lwip = require('lwip');
var imagedata = '';
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
            lwip.create(900, 600, 'white', function (err, canvas) {
                _.each(data.image, function (n) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        db.collection('image').find({
                            "id": n.id
                        }).each(function (err, image) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                            if (image != null) {
                                var fd = sails.ObjectID(image.imagefs);
                                sails.GridStore.read(db, fd, function (err, fileData) {
                                    lwip.open(fileData, 'jpg', function (err, imagefile) {
                                        canvas.paste(n.left, n.top, imagefile, function (err, newimage) {
                                            imagedata = newimage;
                                            i++;
                                            if (i == data.image.length) {
                                                uploadimage();
                                            }
                                        });
                                    });
                                });
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