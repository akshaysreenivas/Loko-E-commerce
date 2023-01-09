const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { date } = require("random-js");
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
    created: {
        type: date,
        default: new Date().toISOString(),
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    phone_number: {
        type: String,
    },

    addressDetails: [
        {

            name: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pin_code: Number,
            country: {
                type: String,
                default: "India"
            }

        }

    ],

    blocked: {
        type: Boolean,
        default: false
    }
});

userSc.pre("save", function (next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
        try {
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
            })
        } catch (err) {
            console.log(err);
        }
    }



});


module.exports = new mongoose.model('users', userSc)