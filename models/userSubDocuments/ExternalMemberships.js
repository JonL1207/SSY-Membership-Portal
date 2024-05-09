const mongoose = require("mongoose");

/**
    Defines the structure for saving a users external memberships into the database

    @tradeUnion                 [String]    an array of trade unions the user is a part of
    @politicalParty             [String]    an array of political parties the user is a part of
    @tenantsUnion               [String]    an array of tenants unions that the user is a part of 
    @campaigningOrganisation    [String]    an array of campaigning organisations that the user is a part of 
*/

const externalMembershipsSchema = new mongoose.Schema(
  {
    tradeUnion: {
      type: String,
    },
    politicalParty: {
      type: String,
    },
    tenantsUnion: {
      type: String,
    },
    campaigningOrganisation: {
      type: String,
    },
  },
  { _id: false }
);

module.exports = {
  externalMembershipsSchema,
};
