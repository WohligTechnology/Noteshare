/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    uploadfile: function (req, res) {
        req.file("file").upload(function (err, uploadedFiles) {
            if (err) return res.send(500, err);
            _.each(uploadedFiles, function (n) {
                var oldpath = n.fd;
                var source = sails.fs.createReadStream(n.fd);
                n.fd = n.fd.split('\\').pop().split('/').pop();
                var dest = sails.fs.createWriteStream('./uploads/' + n.fd);
                source.pipe(dest);
                source.on('end', function () {
                    sails.fs.unlink(oldpath, function (data) {});
                });
                source.on('error', function (err) {
                    console.log(err);
                });
            });
            return res.json({
                message: uploadedFiles.length + ' file(s) uploaded successfully!',
                files: uploadedFiles
            });
        });
    },
    resize: function (req, res) {
        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            var mimetype = sails.mime.lookup(path);
            res.set('Content-Type', mimetype);
            res.send(image);
        }
        var file = req.query.file;
        var filepath = './uploads/' + file;
        var isfile = sails.fs.existsSync(filepath);
        if (!isfile) {
            res.json({
                message: "File not found",
                value: "false"
            });
        } else {
            showimage(filepath);
        }
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