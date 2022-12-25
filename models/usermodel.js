const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSc = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        index: { unique: true },
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    blocked: {
        type: Boolean,
        default: false
    }
});

userSc.pre("save", function (next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                return next(err);
            }
            else {
                bcrypt.hash(user.password, salt)
                    .then((hash) => {
                        user.password = hash;
                        next();
                    })
                    .catch((err) => {
                        return next(err);
                    });

            }

        });
    }



});


module.exports = new mongoose.model('userslist', userSc)