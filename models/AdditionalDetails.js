const mongoose = require("mongoose");

/**
    Define the structure for saving a users additional details into the database

    @skills                 [String]    an array of skills belonging to the user
    @interests              [String]    an array of skills belonging to the user
    @accessibilityNeeds     [String]    an array of any accessibility need the user has
    @isAttendingSecondary   Boolean     true if user is in high school and false if the user is not in high school
    @isAttendingTernary     Boolean     true if the user is in uni/college and false if the user is not in uni/college
    @findUs                 String      how the user found out about the organisation
*/

const additionalDetails = new mongoose.Schema({
  skills: {
    type: [String],
  },
  interests: {
    type: [String],
  },
  accessibilityNeeds: {
    type: [String],
  },
  isAttendingSecondary: {
    type: Boolean,
  },
  isAttendingTernary: {
    type: Boolean,
  },
  findUs: {
    type: String,
  },
});

module.exports = {
  additionalDetails,
};
