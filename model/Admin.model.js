const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profilePicture: String,
    bday: { type: String },
    gender: { type: String },
    bankDetails: String,
    contact: String,
    role: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailToken: String,
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
    notifications: [
      { msg: String, flag: { type: Number, default: 0 }, path: String },
    ],
    blockSites: [
      {
        siteName: String,
        address: String,
      },
    ],
    currency: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
