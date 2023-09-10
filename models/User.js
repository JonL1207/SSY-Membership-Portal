const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail, isStrongPassword } = require("validator");
const {
  generateMembershipNumber,
} = require("../utils/generateMembershipNumber");

const { locationSchema } = require("./Location");
const { additionalDetailsSchema } = require("./AdditionalDetails");
const { externalMembershipsSchema } = require("./ExternalMemberships");
const { membershipSchema } = require("./Membership");
const { inductionSchema } = require("./Induction");

/**
    Defines the structure for saving a user into the database

    @membershipNumber       String      unique membership number for the user in the form <INITIALS-SSY-7_DIGITS-YEAR>
    @firstName              String      the users first name
    @surname                String      the user last name
    @pronouns               String      the users preffered pronouns
    @dateOfBirth            Date        the users date of birth
    @email                  String      the users email
    @phone                  String      the users phone number
    @Password               String      the users password. A strong password is defined as having minlength: 8, minLowercase: 1,
                                        minUppercase: 1, minNumbers: 1, minSymbols: 1
*/

const userSchema = new mongoose.Schema(
  {
    membershipNumber: {
      type: String,
      required: [
        true,
        "Issue allocating membership number, please get in contact for support",
      ],
      unique: true,
      uppercase: true,
      default: "<MEMBERSHIP_NUMBER>",
    },
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      trim: true,
    },
    surname: {
      type: String,
      required: [true, "Please provide surname"],
      trim: true,
    },
    pronouns: {
      type: String,
      required: [true, "Please provide pronouns"],
      uppercase: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide date of birth"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
    },
    password: {
      type: String,
      requires: [true, "Please provide a password"],
      minLength: [8, "Password must be at least 8 character in length"],
      validate: [
        isStrongPassword,
        "Please enter a valid passwsord:- minlength: 8, minLowercaseCharacters: 1, minUppercaseCharacters: 1, minNumbers: 1, minSymbols: 1",
      ],
    },
    location: {
      type: locationSchema,
      required: true,
    },
    additionalDetails: {
      type: additionalDetailsSchema,
      required: true,
    },
    externalMemberships: {
      type: externalMembershipsSchema,
      required: true,
    },
    membership: {
      type: membershipSchema,
      required: true,
    },
    induction: {
      type: inductionSchema,
      required: true,
    },
  },
  { optimisticConcurrency: true, timestamps: true, collection: "members" }
);

/**
 * Format a users memebership number before they are saved to the database
 */
userSchema.pre("save", async function (next) {
  let memberNo = await generateMembershipNumber();
  let existingMembershipNumber = await User.where().findMembershipNumber(
    memberNo
  );

  //if membership number exists then generate a new one
  while (existingMembershipNumber.length > 0) {
    memberNo = await generateMembershipNumber();
    existingMembershipNumber = await User.where().findMembershipNumber(
      memberNo
    );
  }

  this.membershipNumber = memberNo;
  next();
});

/**
 * Encrypt the users password before they are saved to the database
 */
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Query helper to find a membership number
 *
 * @param membershipNumber the membership number to search for
 * @returns array of membership numbers matching the search criteria
 */
userSchema.query.findMembershipNumber = function (membershipNumber) {
  return this.where("membershipNumber")
    .equals(membershipNumber)
    .select({ membershipNumber: 1, _id: 0 });
};

module.exports = User = mongoose.model("User", userSchema);
