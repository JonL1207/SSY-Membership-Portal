const mongoose = require("mongoose");

/**
    Define the structure for saving a user location into the database

    @councilArea            String      the council area that the user lives in
    @city                   String      the town/city/neighbourhood that the user livs in
    @isBasedInScotland        Boolean     true if user lives in Scotland and false if user does not live in Scotland
*/

const locationSchema = new mongoose.Schema({
  councilArea: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  isBasedInScotland: {
    type: Boolean,
  },
});

module.exports = {
  locationSchema,
};
