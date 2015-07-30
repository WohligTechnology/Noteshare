/**
 * DummyController
 *
 * @description :: Server-side logic for managing dummies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
    gridfs: function (req, res) {
        sails.MongoClient.connect("mongodb://localhost:27017/dummy", function (err, db) {
            if(err){
                console.log(err);
            }
            req.file("file").upload({
                maxBytes: 10000000000000
            }, function (err, uploadedFiles) {
                if (err) return res.send(500, err);
                _.each(uploadedFiles, function (n) {
                    var filepath = n.fd
                    db.open(function (err, db) {
                        var fileId = new sails.ObjectID();
                        var gridStore = new sails.GridStore(db, fileId, 'w');
                        gridStore.open(function (err, gridStore) {
                            gridStore.writeFile(filepath, function (err, doc) {
                                sails.GridStore.read(db, fileId, function (err, fileData) {
                                    console.log(fileId);
                                    res.json(fileId);
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
    getimage: function (req, res) {
        sails.MongoClient.connect("mongodb://localhost:27017/dummy", function (err, db) {
            if(err){
                console.log(err);
            }
            var filename = req.query.file;
            var fileId = sails.ObjectID(filename);
            var file = new sails.GridStore(db, fileId, "r");
            file.open(function (err, file) {
                if(err){
                    console.log(err);
                }
                res.set('Content-Type', 'image');
                var stream = file.stream();
                stream.pipe(res);
            });
        });
    }
};