"use strict";

const { Contract, Transaction } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;

// const createPrescription = async (orgData, prescriptionData, fileMetadata, user) => {
//   let gateway;
//   let client;
//   try {
//     let dateTime = new Date();
//     let orgName = org${user.orgId};
//     prescriptionData = {
//       fcn: "CreatePrescription",
//       data: {
//         id: getUUID(),
//         owner: orgName,
//         orgId: parseInt(user.orgId),
//         department: user.department,
//         departmentType: user.departmentType,
//         firstParty: prescriptionData.firstParty,
//         secondParty: prescriptionData.secondParty,
//         status: PRESCRIPTION_STATUS.PERSONALINFO,
//         docType: BLOCKCHAIN_DOC_TYPE.PRESCRIPTION,
//         patient_email: user.email,
//         createBy: user.email,
//         updatedBy: user.email,
//         createAt: dateTime,
//         updatedAt: dateTime,
//         institutionType: orgData.institutionType,
//         location: orgData.location,
//         accessTime: 15 * 60 * 1000,
//         permissionType: PERMISSION_TYPE.WRITE,
//         document: {
//           ...fileMetadata,
//           createBy: user.email,
//           updatedBy: user.email,
//           createAt: dateTime,
//           updatedAt: dateTime,
//         },
//       },
//     };

//     const contract = await getContractObject(
//       orgName,
//       user.email,
//       NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
//       NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
//       gateway,
//       client
//     );
//     await contract.submitTransaction(
//       prescriptionData.fcn,
//       JSON.stringify(prescriptionData.data)
//     );
//     return prescriptionData.data;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     if (gateway) {
//       gateway.close();
//     }
//     if (client) {
//       client.close();
//     }
//   }
// };







class Access extends Contract {

  CreatePrescriptionAccess(ctx) {
    let cid = new ClientIdentity(ctx.stub);
    if (!cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only patient can do this operation"
      );
    } 
  }

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
    if (cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only doctor or pharmacist can do this operation"
      );
    }
  }


  UpdatePrescriptionAccess(ctx, prescriptionData ) {
    let cid = new ClientIdentity(ctx.stub);
    let updatedprescription = JSON.parse(prescriptionData);


    if (!cid.assertAttributeValue("department", "patient")) {
      throw new Error(
        "You are not authorized to perform this operation, Only patient can do this operation"
      );
    }
    
    if ( updatedprescription.updatedBy != updatedprescription.patient_email) {
      throw new Error(
        "You are not authorized to perform this operation"
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
