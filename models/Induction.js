const mongoose = require("mongoose");

/**
    Define the structure for saving a users induction status into the database

    @isAwaiting     Boolean     true if the user is waiting to be made an organiser and false if not
    @status         String      the status of the induction
*/

const induction = new mongoose.Schema({
  isAwaiting: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    trim: true,
    uppercase: true,
    enum: ["N/A", "WAITING", "COMPLETE"],
  },
});

module.exports = {
  induction,
};
