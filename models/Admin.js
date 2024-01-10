const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    validate: [
      {
        validator: function (v) {
          return /^(?=.*[a-z])/.test(v);
        },
        message: "Password must contain at least one lowercase letter",
      },
      {
        validator: function (v) {
          return /^(?=.*[A-Z])/.test(v);
        },
        message: "Password must contain at least one uppercase letter",
      },
      {
        validator: function (v) {
          return /^(?=.*_)/.test(v);
        },
        message: "Password must contain at least one underscore (_) character",
      },
    ],
  },
});

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
