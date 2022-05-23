const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// this function is ran before every SAVE operation. Purpose -> creating salt
userSchema.pre("save", function (next) {
  // can't use an arrow func as it'll change the context of 'this' keyword.
  const user = this;
  // else condition.
  if (!user.isModified("password")) {
    return next();
  }

  // if we are trying to modify (probably enter a new password)
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
        // hash => random salt + hashed password
        if (err) {
            return next(err);
        }
        user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (passwordProvided) {
  // can't use an arrow func as it'll change the context of 'this' keyword.
  const user = this;

  return new Promise((resolve, reject) => {
      // compares plain text password with salted password
    bcrypt.compare(passwordProvided, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
