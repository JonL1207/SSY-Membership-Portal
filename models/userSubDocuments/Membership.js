const mongoose = require("mongoose");
const { inductionSchema } = require("./Induction");

/**
    Defines the structure for saving a users induction status into the database

    @role               String      the role the user has within the system, e.g. member, admin, operator
    @type               String      the type of membership a user has, e.g. supporter, general, operator
    @stripeID           String      the users ID for their connected stripe account
    @isPaying           Boolean     true if user is currently paying for membership and false if not
    @isDiscretionary    Boolean     true if the user was given a membership by an admin and false if they created their membership theirself
*/

const membershipSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Please provide a role"],
      uppercase: true,
      trim: true,
      enum: ["MEMBER", "ADMIN", "OPERATOR"],
      default: "MEMBER",
    },
    type: {
      type: String,
      uppercase: true,
      required: [true, "Please provide a membership type"],
      trim: true,
      enum: ["SUPPORTER", "GENERAL", "ORGANISER"],
      default: "GENERAL",
    },
    stripeID: {
      type: String
    },
    isPaying: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDiscretionary: {
      type: Boolean,
      default: false,
    },
    induction: {
      type: inductionSchema,
      required: true,
    },
  },
  { _id: false }
);

module.exports = {
  membershipSchema,
};
