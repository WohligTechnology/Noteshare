/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
        clientID: "1037714210694-1hha4c8pbfr3v3922u1o9rq9ahqe58qe.apps.googleusercontent.com",
        clientSecret: "evdpiycmTSRae_mk2vQVWBzZ",
        callbackURL: "callbackg"
    },
    function(token, tokenSecret, profile, done) {
        profile.token = token;
        profile.tokenSecret = tokenSecret;
        profile.provider = "Google";
        User.googlelogin(profile, done);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

module.exports = {
    // logingoogle: function(req, res) {
    //     var user = req.param("user");
    //     passport.use(new GoogleStrategy({
    //             clientID: "1037714210694-1hha4c8pbfr3v3922u1o9rq9ahqe58qe.apps.googleusercontent.com",
    //             clientSecret: "evdpiycmTSRae_mk2vQVWBzZ",
    //             callbackURL: "callbackg"
    //         },
    //         function(token, tokenSecret, profile, done) {
    //             profile.token = token;
    //             profile.tokenSecret = tokenSecret;
    //             profile.provider = "Google";
    //             User.googlelogin(profile, done);
    //         }
    //     ));
    //     var loginid = req.param("loginid");
    //     req.session.loginid = loginid;
    //     passport.authenticate('google', {
    //         scope: "https://www.googleapis.com/auth/plus.login email"
    //     })(req, res);
    // },
    // callbackg: passport.authenticate('google', {
    //     successRedirect: '/user/success',
    //     failureRedirect: '/user/fail'
    // }),
    // success: function(req, res, data) {
    //     if (req.session.passport) {
    //         sails.sockets.blast("login", {
    //             loginid: req.session.loginid,
    //             status: "success",
    //             user: req.session.passport.user
    //         });
    //     }
    //     res.view("success");
    // },
    // fail: function(req, res) {
    //     sails.sockets.blast("login", {
    //         loginid: req.session.loginid,
    //         status: "fail"
    //     });
    //     res.view("fail");
    // },
    // profile: function(req, res) {
    //     if (req.session.passport) {
    //         res.json(req.session.passport.user);
    //     } else {
    //         res.json({});
    //     }
    // },
    // logout: function(req, res) {
    //     req.session.destroy(function(err) {
    //         res.send(req.session);
    //     });
    // },

    uploadfile: function(req, res) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: "false",
                    comment: "Error"
                });
            } else if (db) {
                req.file("file").upload({
                    maxBytes: 100000000
                }, function(err, uploadedFiles) {
                    if (err) {
                        console.log(err);
                        res.json({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else if (uploadedFiles) {
                        _.each(uploadedFiles, function(n) {
                            var filepath = n.fd;
                            var newfilepath = n.fd;
                            var newfilenamearr = newfilepath.split(".");
                            var extension = newfilenamearr.pop();
                            var mimetype = sails.mime.lookup(n.fd);
                            var newdate = sails.moment(new Date()).format('YYYY-MM-DDh-mm-ss-SSSSa');
                            var filename = 'image' + newdate + '.' + extension;
                            db.open(function(err, db) {
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        value: "false",
                                        comment: "Error"
                                    });
                                    db.close();
                                } else if (db) {
                                    var fileId = new sails.ObjectID();
                                    var gridStore = new sails.GridStore(db, fileId, filename, 'w', {
                                        content_type: mimetype
                                    });
                                    gridStore.open(function(err, gridStore) {
                                        if (err) {
                                            console.log(err);
                                            res.json({
                                                value: "false",
                                                comment: "Error"
                                            });
                                            db.close();
                                        } else if (gridStore) {
                                            gridStore.writeFile(filepath, function(err, doc) {
                                                if (err) {
                                                    console.log(err);
                                                    res.json({
                                                        value: "false",
                                                        comment: "Error"
                                                    });
                                                    db.close();
                                                } else if (doc) {
                                                    sails.fs.unlink(filepath, function(err) {
                                                        if (err) {
                                                            console.log(err);
                                                        }
                                                        console.log(req.param('user'));
                                                        var userid = req.param('user');
                                                        var user = sails.ObjectID(userid);
                                                        db.collection('user').update({
                                                            _id: user
                                                        }, {
                                                            $set: {
                                                                profilepic: fileId
                                                            }
                                                        }, function(err, updated) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.json({
                                                                    value: "false"
                                                                });
                                                                db.close();
                                                            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                                                                res.json({
                                                                    fileId: fileId
                                                                });
                                                                db.close();
                                                            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                                                res.json({
                                                                    value: "true",
                                                                    comment: "Data already updated"
                                                                });
                                                                db.close();
                                                            } else {
                                                                res.json({
                                                                    value: "false",
                                                                    comment: "No data found"
                                                                });
                                                                db.close();
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    },
    getupload: function(req, res) {
        if (req.query.file && req.query.file != "" && sails.ObjectID.isValid(req.query.file)) {
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                } else if (db) {
                    var filename = req.query.file;
                    var fileId = sails.ObjectID(filename);
                    var file = new sails.GridStore(db, fileId, "r");
                    db.collection("fs.files").find({
                        _id: fileId
                    }).toArray(function(err, found) {
                        if (err) {
                            console.log(err);
                            res.json({
                                value: "false",
                                comment: "Error"
                            });
                            db.close();
                        } else if (found && found[0]) {
                            file.open(function(err, file) {
                                if (err) {
                                    console.log(err);
                                    res.json({
                                        value: "false",
                                        comment: "Error"
                                    });
                                    db.close();
                                } else if (file) {
                                    res.set('Content-Type', file.contentType);
                                    var stream = file.stream();
                                    stream.pipe(res);
                                    file.close();
                                }
                            });
                        } else {
                            res.json({
                                value: "false",
                                comment: "No data found"
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            res.json({
                value: "false",
                comment: "Upload-id is incorrect"
            });
        }
    },
    deleteupload: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.deleteupload(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Upload-id is incorrect"
            });
        }
    },
    // save: function(req, res) {
    //     if (req.body._id) {
    //         if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
    //             user();
    //         } else {
    //             res.json({
    //                 value: "false",
    //                 comment: "User-id is incorrect"
    //             });
    //         }
    //     } else {
    //         user();
    //     }

    //     function user() {
    //         var print = function(data) {
    //             res.json(data);
    //         }
    //         User.save(req.body, print);
    //     }
    // },
    saveuser: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.saveuser(req.body, print);
    },
    find: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.find(req.body, print);
    },
    findlimited: function(req, res) {
        if (req.body.pagesize && req.body.pagesize != "" && req.body.pagenumber && req.body.paenumber != "") {
            var print = function(data) {
                res.json(data);
            }
            User.findlimited(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Please provide parameters"
            });
        }
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findoneuser: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.findoneuser(req.body, print);
    },
    searchmail: function(req, res) {
        if (req.body.email && req.body.email != "") {
            var print = function(data) {
                res.json(data);
            }
            User.searchmail(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Please providde email-ID"
            });
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    deletealluser: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.deletealluser(req.body, print);
    },
    // login: function(req, res) {
    //     if (req.body.email && req.body.email != "" && req.body.password && req.body.password != "") {
    //         var print = function(data) {
    //             res.json(data);
    //         }
    //         User.login(req.body, print);
    //     } else {
    //         res.json({
    //             value: "false",
    //             comment: "Please provide parameters"
    //         });
    //     }
    // },
    sociallogin: function(req, res) {
        if (req.body) {
            if (req.body.email && req.body.email != "" && req.body.profilepic && req.body.profilepic != "" && req.body.name && req.body.name != "") {
                var print = function(data) {
                    res.json(data);
                }
                User.sociallogin(req.body, print);
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
    changepassword: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.changepassword(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    forgotpassword: function(req, res) {
        if (req.body.email && req.body.email != "") {
            var print = function(data) {
                res.json(data);
            }
            User.forgotpassword(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Please providde email-ID"
            });
        }
    },
    countusers: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.countusers(req.body, print);
    },
    countnotes: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.countnotes(req.body, print);
    },
    dataDisplay: function(req, res) {
        var dataToDisplay = req.query("data");
        res.view("data", dataToDisplay);
    },
    currentTime: function(req, res) {
        res.json(new Date());
    }
};
