"use strict";

const { Contract, Transaction } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;


class Access extends Contract {

  CreatePersonalInfoAccess(ctx) {

    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only patient can do this operation"
      );
    }

  }
  CreateDiagnosisAccess(ctx) {

    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "doctor")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor can do this operation"
      );
    }

  }
  CreateMedicationAccess(ctx) {

    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "doctor")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor can do this operation"
      );
    }

  }
  CreateMedCountAccess(ctx) {

    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "pharmacist")) {
      throw new Error(
        "You are not authorized to perform this operation, Only pharmacist can do this operation"
      );
    }

  }


}
module.exports = Access