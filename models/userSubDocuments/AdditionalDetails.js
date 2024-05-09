const mongoose = require("mongoose");

/**
    Defines the structure for saving a users additional details into the database

    @skills                 [String]    an array of skills belonging to the user
    @interests              [String]    an array of skills belonging to the user
    @isAttendingSecondary   Boolean     true if user is in high school and false if the user is not in high school
    @isAttendingTernary     Boolean     true if the user is in uni/college and false if the user is not in uni/college
*/

const additionalDetailsSchema = new mongoose.Schema(
    {
        skills: {
            type: [String],
            default: undefined,
        },
        interests: {
            type: [String],
            default: undefined,
        },
        isAttendingSecondary: {
            type: Boolean,
        },
        isAttendingTernary: {
            type: Boolean,
        },
    },
    { _id: false }
);

module.exports = {
    additionalDetailsSchema,
};
