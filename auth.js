const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            // Get user by Email
            const user = await User.findOne({email: email});

            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if (isMatch) {
                    resolve(user);
                } else {
                    reject('Authentication Failed');
                }
            });
        } catch (err) {
            reject("Authentication Failed");
        }
    });
}