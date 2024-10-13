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

  CreateAccessRequestAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (
      !cid.assertAttributeValue("department", "pharmacist") ||
      !cid.assertAttributeValue("department", "doctor")
    ) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor or pharmacist can do this operation"
      );
    }
  }

  UpdatePersonalInfoAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only patient can do this operation"
      );
    }
  }

  UpdateDiagnosisAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "doctor")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor can do this operation"
      );
    }
  }

  UpdateMedicationAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "doctor")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor can do this operation"
      );
    }
  }

  UpdateMedCountAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "pharmacist")) {
      throw new Error(
        "You are not authorized to perform this operation, Only pharmacist can do this operation"
      );
    }
  }

  UpdateAccessRequestAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only patient can do this operation"
      );
    }
  }

  DeletePersonalInfoAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only patient can do this operation"
      );
    }
  }

  DeleteDiagnosisAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "doctor")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor can do this operation"
      );
    }
  }

  DeleteMedicationAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "doctor")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor can do this operation"
      );
    }
  }

  DeleteMedCountAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "pharmacist")) {
      throw new Error(
        "You are not authorized to perform this operation, Only pharmacist can do this operation"
      );
    }
  }

  // DeleteAccessRequestAccess(ctx) {
  //   let cid = new ClientIdentity(ctx.stub);
  //   if (!cid.assertAttributeValue("department", "pharmacist")) {
  //     throw new Error(
  //       "You are not authorized to perform this operation, Only pharmacist can do this operation"
  //     );
  //   }
  // }
}
module.exports = Access;
