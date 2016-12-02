module.exports = function (models) {
    const {
        User
    } = models;

    return {
        findUserByEmail(email) {
            return new Promise((resolve, reject) => {
                User.findOne({
                    email
                }, (err, user) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(user);
                });
            });
        },
        findUserById(id) {
            return new Promise((resolve, reject) => {
                User.findById(id, (err, user) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(user);
                });
            });
        },
        updateUserPasswordReset(id, token, resetDate) {
            return User.findByIdAndUpdate(id, {
                passwordResetToken: token,
                passwordResetExpires: resetDate
            });
        },
        findUserByResetToken(token, date) {
            return new Promise((resolve, reject) => {
                User.findOne({
                        passwordResetToken: token
                    })
                    .where('passwordResetExpires').gt(date)
                    .exec((err, user) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(user);
                    });
            });
        },
        updateUserPassword(id, password) {
            return new Promise((resolve, reject) => {
                User.findById(id, (err, user) => {
                    if (err) {
                        reject(err);
                    }

                    user.password = password;
                    user.save((error) => {
                        if (error) {
                            reject(error);
                        }

                        resolve(user);
                    });
                });
            });
        },
        registerUser(email, password, username, description) {
            const user = new User({
                email,
                password,
                username,
                description
            });

            return new Promise((resolve, reject) => {
                user.save((err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(user);
                });
            });
        },
        updateUserById(id, options) {
            return new Promise((resolve, reject) => {
                User.findById(id, (err, user) => {
                    if (err) {
                        reject(err);
                    }

                    user.email = options.email;
                    user.profile.name = options.profileName;
                    user.profile.gender = options.profileGender;
                    user.profile.location = options.profileLocation;
                    user.profile.website = options.profileWebsite;
                    user.username = options.username;
                    user.description = options.description;

                    console.log(options);

                    user.save((err) => {
                        if (err) {
                            reject(err);
                        }

                        console.log(user);
                        
                        resolve(user);
                    });
                });
            });
        },
        updateTokensProvider(id, provider, tokens) {
            User.findById(req.user.id, (err, user) => {
                user[provider] = provider;
                user.tokens = tokens;
                user.save(err => new Promise((resolve, reject) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(user);
                }));
            });
        },
        deleteUser(id) {
            return new Promise((resolve, reject) => {
                User.remove({
                    _id: id
                }, (err) => {
                    if (err) {
                        reject(err);
                    }
                });
            });
        },
        findUserByUsername(username) {
            return new Promise((resolve, reject) => {
                User.findOne({
                    username
                }, (err, user) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(user);
                });
            });
        }
    };
};