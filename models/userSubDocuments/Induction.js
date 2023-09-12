const mongoose = require("mongoose");

/**
    Defines the structure for saving a users induction status into the database

    @isAwaiting     Boolean     true if the user is waiting to be made an organiser and false if not
    @status         String      the status of the induction
*/

const inductionSchema = new mongoose.Schema(
  {
    isAwaiting: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["N/A", "WAITING", "COMPLETE"],
      default: "N/A",
    },
  },
  { _id: false }
);

module.exports = {
  inductionSchema,
};
