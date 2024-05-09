const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail, isStrongPassword } = require("validator");
const {
  generateMembershipNumber,
} = require("../utils/generateMembershipNumber");
const { isValidDOB } = require("../utils/validateDOB");
const { locationSchema } = require("./userSubDocuments/Location");
const {
  additionalDetailsSchema,
} = require("./userSubDocuments/AdditionalDetails");
const {
  externalMembershipsSchema,
} = require("./userSubDocuments/ExternalMemberships");
const { membershipSchema } = require("./userSubDocuments/Membership");

/**
    Defines the structure for saving a user into the database

    @membershipNumber       String      unique membership number for the user in the form <SSY-7_DIGITS-YEAR>
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
        "Issue allocating membership number, get in contact for further support",
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
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      trim: true,
    },
    pronouns: {
      type: String,
      required: [true, "Please provide preferred pronouns"],
      uppercase: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide date of birth"],
      validate: [isValidDOB, "Must be between age 14 and 30"],
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: [8, "Password must be at least 8 characters in length"],
      validate: [
        isStrongPassword,
        "Please enter a valid passwsord:- minlength: 8, minLowercaseCharacters: 1, minUppercaseCharacters: 1, minNumbers: 1, minSymbols: 1",
      ],
    },
    location: {
      type: locationSchema
    },
    additionalDetails: {
      type: additionalDetailsSchema
    },
    externalMemberships: {
      type: externalMembershipsSchema
    },
    membership: {
      type: membershipSchema,
      required: true,
    },
  },
  { optimisticConcurrency: true, timestamps: true, collection: "members" }
);

/**
 * When called returns the first name and surname concatenated into a full name
 */
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.surname}`;
});

/**
 * Query helper to find a membership number
 *
 * @param {String} membershipNumber the membership number used for the search
 * @returns {Query} membership numbers matching the search criteria
 */
userSchema.query.findMembershipNumber = function (membershipNumber) {
  return this.where("membershipNumber")
    .equals(membershipNumber)
    .select({ membershipNumber: 1, _id: 0 });
};

/**
 * Query helper to find a document by email
 *
 * @param {String} email the email used for the search
 * @param {Boolean} pass true if you want the password in returned document and false if not
 * @returns {Query} documents with email addresses matching the search criteria
 */
userSchema.query.findByEmail = function (email, pass) {
  if (!pass) {
    return this.where("email").equals(email).select({ password: 0 });
  }

  return this.where("email").equals(email);
};

/**
 * Query helper to retrieve all documents
 *
 * @returns {Query} all documents without the password field
 */
userSchema.query.getAll = function () {
  return this.where().select({ password: 0 });
};

/**
 * Format a users membership number before they are saved to the database
 */
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    let memberNo = await generateMembershipNumber();
    let existingMembershipNumber = await User.findOne().findMembershipNumber(
      memberNo
    );

    //if membership number exists then generate a new one
    while (existingMembershipNumber) {
      memberNo = await generateMembershipNumber();
      existingMembershipNumber = await User.findOne().findMembershipNumber(
        memberNo
      );
    }

    this.membershipNumber = memberNo;
  }

  next();
});

/**
 * Encrypt the users password before they are saved to the database
 */
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

/**
 * Searches for a user with the provided email
 *
 * @param {String} email the email to search for
 * @returns {Boolean} true if exist within db, false if not
 */
userSchema.statics.findRegistered = async function (email) {
  const existing = await this.findOne().findByEmail(email, false);

  if (existing) {
    return true;
  } else {
    return false;
  }
};

/**
 * Register a new user to the database if that user does not already exist
 *
 * @returns {Object} message confirming user has been regitered
 */
userSchema.methods.register = async function () {
  const existingEmail = await User.findRegistered(this.email);

  if (existingEmail) {
    throw Error("The email provided is already registered", { cause: "email" });
  } else {
    await this.save();
    return {
      message: "User has been registered successfully",
    };
  }
};

/**
 * Checks if a user exists within database based on the email and passoword provided
 *
 * @param {String} email the email to search for
 * @param {String} password the password to compare with existing user if one exists
 * @returns {Object} the existing user that wishes to be logged in
 */
userSchema.statics.login = async function (email, password) {
  if (!email) {
    throw Error("Please provide an email", { cause: "email" });
  }

  if (!password) {
    throw Error("Please provide a password", { cause: "password" });
  }

  var user = await this.findOne().findByEmail(email, true);

  if (user) {
    const authenticate = await bcrypt.compare(password, user.password);

    if (authenticate) {
      user = await this.findOne().findByEmail(email, false);
      return user;
    } else {
      throw Error("The password you have provided is incorrect", {
        cause: "password",
      });
    }
  } else {
    throw Error("The email provided has not been registered", {
      cause: "email",
    });
  }
};

/**
 * Finds a user and applies and update if that user exists
 *
 * @param {String} id the id of the user to be updated
 * @param {Object} update the update to be applied
 * @returns {Object} the updated user
 */
userSchema.statics.update = async function (id, update) {
  if (!id) {
    throw Error("Please provide the user ID", { cause: "userID" });
  }

  if (!update) {
    throw Error("Please provide an update", { cause: "update" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("Please provide a valid user id", { cause: "userID" });
  }

  var user = await this.findByIdAndUpdate(id, update, { new: true });

  if (user) {
    user = await this.findOne().findByEmail(user.email, false);
    return user;
  } else {
    throw Error("The user being attempted to be updated does not exist", {
      cause: "userID",
    });
  }
};

/**
 * Finds a user and updates their password if they exist
 *
 * @param {String} id the id of the user to be updated
 * @param {String} password the new password
 * @returns {Object} the updated user
 */
userSchema.statics.updatePassword = async function (id, password) {
  if (!id) {
    throw Error("Please provide the user ID", { cause: "userID" });
  }

  if (!password) {
    throw Error("Please provide a password", { cause: "password" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("Please provide a valid user id", { cause: "userID" });
  }

  if (!isStrongPassword(password)) {
    throw Error("Password provided is not strong enough", {
      cause: "password",
    });
  }

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  var user = await this.findByIdAndUpdate(
    id,
    { password: password },
    { new: true }
  );

  if (user) {
    user = await this.findOne().findByEmail(user.email, false);
    return user;
  } else {
    throw Error("The user attempting to update does not exist", {
      cause: "userID",
    });
  }
};

/**
 * Find a user and delete that user if they exist
 *
 * @param {String} id the id of the user to be deleted
 * @returns {Object} the deleted user
 */
userSchema.statics.delete = async function (id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("Please provide a valid user id");
  }

  const user = await this.findByIdAndDelete(id);

  if (user) {
    return user;
  } else {
    throw Error("The user being attempted to be deleted does not exist", {
      cause: "userID",
    });
  }
};

/**
 * Finds a user if they exist
 *
 * @param {String} id the id of the user to be found
 * @returns {Object} the requested user
 */
userSchema.statics.getSingleUser = async function (id) {
  if (!id) {
    throw Error("Please provide the user ID", { cause: "userID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw Error("Please provide a valid user id", { cause: "userID" });
  }

  var user = await this.findById(id);

  if (user) {
    user = await this.findOne().findByEmail(user.email, false);
    return user;
  } else {
    throw Error("The user being attempted to be found does not exist", {
      cause: "userID",
    });
  }
};

/**
 * Retrieves all documents if there are any that exist
 *
 * @returns {Array} all documents within the database
 */
userSchema.statics.getAllUsers = async function () {
  const users = await this.find().getAll();

  if (users.length > 0) {
    return users;
  } else {
    throw Error("There are currently no users");
  }
};

module.exports = User = mongoose.model("User", userSchema);
