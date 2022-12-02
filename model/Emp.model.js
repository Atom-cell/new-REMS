var mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Define a schema
var empSchema = mongoose.Schema({
  active: {
    type: Boolean,
    default: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: "https://i.stack.imgur.com/34AD2.jpg",
  },
  role: {
    type: String,
    default: "Employee",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  emailToken: String,
  updated: {
    type: Boolean,
    default: false,
  },
  contact: {
    type: String,
  },
  bday: String,
  gender: String,
  desktop: {
    type: Boolean,
    default: false,
  },
  status: Boolean,
  screenshot: [
    {
      date: Date,
      img: String,
    },
  ],
  totalTime: [
    {
      date: Date,
      activetime: Schema.Types.Mixed,
      idletime: Schema.Types.Mixed,
    },
  ],
  appTime: [
    {
      date: Date,
      apps: Schema.Types.Mixed,
    },
  ],

  separateTime: [
    {
      date: Date,
      idle: {
        type: Array,
      },
      active: {
        type: Array,
      },
      // 11 pm
      idleDay: {
        type: Array,
      },
      activeDay: {
        type: Array,
      },
    },
  ],
  // dayTime: [
  //   {
  //     date: Date,
  //     idleDay: {
  //       type: Array,
  //     },
  //     activeDay: {
  //       type: Array,
  //     },
  //   },
  // ],

  notifications: [
    { msg: String, flag: { type: Number, default: 0 }, path: String },
  ],
  flag: String,

  billingId: String, // This is Stripe Customer ID
  attendance: [Date],
  bankDetails: String,
  // date is string because easier to filter
  InOut: [{ date: String, In: Date, Out: Date }],
  hourlyRate: Number,
});

module.exports = mongoose.model("employee", empSchema);
