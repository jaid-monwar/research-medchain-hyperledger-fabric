const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { Gateway, Wallets } = require("fabric-network");
const {
  getContractObject,
  getWalletPath,
  getCCP,
  getPrescriptionsWithPagination,
} = require("../utils/blockchainUtils");
const {
  NETWORK_ARTIFACTS_DEFAULT,
  BLOCKCHAIN_DOC_TYPE,
  PRESCRIPTION_STATUS,
  FILTER_TYPE,
  ACCESS_STATUS,
  PERMISSION_TYPE,
} = require("../utils/Constants");
const { getUUID } = require("../utils/uuid");
const { getSignedUrl } = require("../utils/fileUpload");
const { filter } = require("compression");
const THIRTY_DAYS = 2592000000;

// If we are sure that max records are limited, we can use any max number
const DEFAULT_MAX_RECORDS = 100;
const utf8Decoder = new TextDecoder();

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const createPrescription = async (prescriptionData, fileMetadata, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    prescriptionData = {
      fcn: "CreatePrescription",
      data: {
        id: getUUID(),
        owner: orgName,
        orgId: parseInt(user.orgId),
        department: user.department,
        departmentType: user.departmentType,
        firstParty: prescriptionData.firstParty,
        secondParty: prescriptionData.secondParty,
        status: PRESCRIPTION_STATUS.ACTIVE,
        docType: BLOCKCHAIN_DOC_TYPE.PRESCRIPTION,
        patient_email: user.email,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        institutionType: prescriptionData.institutionType,
        location: prescriptionData.location,
        accessTime: 15 * 60 * 1000,
        document: {
          ...fileMetadata,
          createBy: user.email,
          updatedBy: user.email,
          createAt: dateTime,
          updatedAt: dateTime,
        },
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    await contract.submitTransaction(
      prescriptionData.fcn,
      JSON.stringify(prescriptionData.data)
    );
    return prescriptionData.data;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Update a prescription
 * @param {Object} prescriptionData
 * @param {Object} user
 * @returns {Promise<Object>}
 */
const updatePrescription = async (prescriptionId, prescriptionData, oldPrescriptionData, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    if (!prescriptionData.owner) {
      prescriptionData.owner = oldPrescriptionData.owner
    }
    if (!prescriptionData.department) {
      prescriptionData.department = oldPrescriptionData.department
    }
    if (!prescriptionData.firstParty) {
      prescriptionData.firstParty = oldPrescriptionData.firstParty
    }
    if (!prescriptionData.secondParty) {
      prescriptionData.secondParty = oldPrescriptionData.secondParty
    }
    if (!prescriptionData.patient_email) {
      prescriptionData.patient_email = oldPrescriptionData.patient_email
    }
    if (!prescriptionData.status) {
      prescriptionData.status = oldPrescriptionData.status
    }
    if (!prescriptionData.createBy) {
      prescriptionData.createBy = oldPrescriptionData.createBy
    }
    if (!prescriptionData.createAt) {
      prescriptionData.createAt = oldPrescriptionData.createAt
    }
    if (!prescriptionData.institutionType) {
      prescriptionData.institutionType = oldPrescriptionData.institutionType
    }
    if (!prescriptionData.location) {
      prescriptionData.location = oldPrescriptionData.location
    }
    if (!prescriptionData.comment) {
      prescriptionData.comment = oldPrescriptionData.comment
    }






    prescriptionData = {
      fcn: "UpdatePrescription",
      data: {
        id: prescriptionId,
        owner: prescriptionData.owner,
        orgId: parseInt(user.orgId),
        department: prescriptionData.department,
        firstParty: prescriptionData.firstParty,
        secondParty: prescriptionData.secondParty,
        patient_email: prescriptionData.patient_email,
        status: prescriptionData.status,
        docType: BLOCKCHAIN_DOC_TYPE.PRESCRIPTION,
        createBy: prescriptionData.createBy,
        updatedBy: user.email,
        createAt: prescriptionData.createAt,
        updatedAt: dateTime,
        document: {
          ...oldPrescriptionData.document,
          updatedBy: user.email,
          updatedAt: dateTime,
        },
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    console.log(prescriptionData.data)
    await contract.submitTransaction(
      prescriptionData.fcn,
      JSON.stringify(prescriptionData.data)
    );
    return prescriptionData.data;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const approveAgreement = async (approvalData, agreementId, user) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    approvalData = {
      fcn: "CreateContract",
      data: {
        id: getUUID(),
        agreementId: agreementId,
        description: approvalData.description,
        docType: BLOCKCHAIN_DOC_TYPE.APPROVAL,
        status: approvalData.status,
        action: approvalData.action,
        comment: approvalData.comment,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      approvalData.fcn,
      JSON.stringify(approvalData.data)
    );

    let agreement = await queryAgreementById(agreementId, user);
    if (agreement.status === AGREEMENT_STATUS.INPROGRESS) {
      agreement.status = AGREEMENT_STATUS.ACTIVE;
      await contract.submitTransaction(
        approvalData.fcn,
        JSON.stringify(agreement)
      );
    }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const createPersonalInfo = async (personalinfoData, prescriptionId, user) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    personalinfoData = {
      fcn: "CreatePersonalInfo",
      data: {
        id: getUUID(),
        prescriptionId: prescriptionId,
        name: personalinfoData.name,
        age: personalinfoData.age,
        gender: personalinfoData.gender,
        address: personalinfoData.address,
        phone: personalinfoData.phone,
        docType: BLOCKCHAIN_DOC_TYPE.PERSONALINFO,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      personalinfoData.fcn,
      JSON.stringify(personalinfoData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.PERSONALINFO) {
    //   prescription.status = PRESCRIPTION_STATUS.DIAGNOSIS;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const updatePersonalInfo = async (
  personalinfoData,
  oldPersonalInfoData,
  personalInfoId,
  user
) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    // if some fields are not updated, then use the old data

    if (!personalinfoData.prescriptionId) {
      personalinfoData.prescriptionId = oldPersonalInfoData.prescriptionId;
    }
    if (!personalinfoData.name) {
      personalinfoData.name = oldPersonalInfoData.name;
    }
    if (!personalinfoData.age) {
      personalinfoData.age = oldPersonalInfoData.age;
    }
    if (!personalinfoData.gender) {
      personalinfoData.gender = oldPersonalInfoData.gender;
    }
    if (!personalinfoData.address) {
      personalinfoData.address = oldPersonalInfoData.address;
    }
    if (!personalinfoData.phone) {
      personalinfoData.phone = oldPersonalInfoData.phone;
    }

    personalinfoData = {
      fcn: "UpdatePersonalInfo",
      data: {
        id: personalInfoId,
        prescriptionId: personalinfoData.prescriptionId,
        name: personalinfoData.name,
        age: personalinfoData.age,
        gender: personalinfoData.gender,
        address: personalinfoData.address,
        phone: personalinfoData.phone,
        docType: BLOCKCHAIN_DOC_TYPE.PERSONALINFO,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      personalinfoData.fcn,
      JSON.stringify(personalinfoData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.PERSONALINFO) {
    //   prescription.status = PRESCRIPTION_STATUS.DIAGNOSIS;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const deletePersonalInfo = async (personalInfoId, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    let personalinfoData = {
      fcn: "DeletePersonalInfo",
      data: personalInfoId,
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      personalinfoData.fcn,
      personalinfoData.data
    );

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const createDiagnosis = async (diagnosisData, prescriptionId, user) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    diagnosisData = {
      fcn: "CreateDiagnosis",
      data: {
        id: getUUID(),
        prescriptionId: prescriptionId,
        description: diagnosisData.description,
        comment: diagnosisData.comment,
        docType: BLOCKCHAIN_DOC_TYPE.DIAGNOSIS,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      diagnosisData.fcn,
      JSON.stringify(diagnosisData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.DIAGNOSIS) {
    //   prescription.status = PRESCRIPTION_STATUS.MEDICATION;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const updateDiagnosis = async (
  diagnosisData,
  oldDiagnosisData,
  diagnosisId,
  user
) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    // if some fields are not updated, then use the old data

    if (!diagnosisData.prescriptionId) {
      diagnosisData.prescriptionId = oldDiagnosisData.prescriptionId;
    }

    if (!diagnosisData.description) {
      diagnosisData.description = oldDiagnosisData.description;
    }
    if (!diagnosisData.comment) {
      diagnosisData.comment = oldDiagnosisData.comment;
    }
    diagnosisData = {
      fcn: "UpdateDiagnosis",
      data: {
        id: diagnosisId,
        prescriptionId: diagnosisData.prescriptionId,
        description: diagnosisData.description,
        comment: diagnosisData.comment,
        docType: BLOCKCHAIN_DOC_TYPE.DIAGNOSIS,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      diagnosisData.fcn,
      JSON.stringify(diagnosisData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.DIAGNOSIS) {
    //   prescription.status = PRESCRIPTION_STATUS.MEDICATION;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const deleteDiagnosis = async (diagnosisId, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    let diagnosisData = {
      fcn: "DeleteDiagnosis",
      data: diagnosisId,
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      diagnosisData.fcn,
      diagnosisData.data
    );

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const createMedication = async (medicationData, prescriptionId, user) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    medicationData = {
      fcn: "CreateMedication",
      data: {
        id: getUUID(),
        prescriptionId: prescriptionId,
        medname: medicationData.medname,
        meddose: medicationData.meddose,
        medcount: medicationData.medcount,
        comment: medicationData.comment,
        docType: BLOCKCHAIN_DOC_TYPE.MEDICATION,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      medicationData.fcn,
      JSON.stringify(medicationData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.MEDICATION) {
    //   prescription.status = PRESCRIPTION_STATUS.MEDCOUNT;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const updateMedication = async (
  medicationData,
  oldMedicationData,
  medicationId,
  user
) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    // if some fields are not updated, then use the old data

    if (!medicationData.prescriptionId) {
      medicationData.prescriptionId = oldMedicationData.prescriptionId;
    }
    if (!medicationData.medname) {
      medicationData.medname = oldMedicationData.medname;
    }
    if (!medicationData.meddose) {
      medicationData.meddose = oldMedicationData.meddose;
    }
    if (!medicationData.medcount) {
      medicationData.medcount = oldMedicationData.medcount;
    }
    if (!medicationData.comment) {
      medicationData.comment = oldMedicationData.comment;
    }

    medicationData = {
      fcn: "UpdateMedication",
      data: {
        id: medicationId,
        prescriptionId: medicationData.prescriptionId,
        medname: medicationData.medname,
        meddose: medicationData.meddose,
        medcount: medicationData.medcount,
        comment: medicationData.comment,
        docType: BLOCKCHAIN_DOC_TYPE.MEDICATION,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      medicationData.fcn,
      JSON.stringify(medicationData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.MEDICATION) {
    //   prescription.status = PRESCRIPTION_STATUS.MEDCOUNT;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const deleteMedication = async (medicationId, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    let medicationData = {
      fcn: "DeleteMedication",
      data: medicationId,
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      medicationData.fcn,
      medicationData.data
    );

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Agreement>}
 */
const createMedCount = async (medcountData, medicationId, user) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    medcountData = {
      fcn: "CreateMedCount",
      data: {
        id: getUUID(),
        medicationId: medicationId,
        medname: medcountData.description,
        medbought: medcountData.medbought,
        docType: BLOCKCHAIN_DOC_TYPE.MEDCOUNT,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      medcountData.fcn,
      JSON.stringify(medcountData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.MEDCOUNT) {
    //   prescription.status = PRESCRIPTION_STATUS.PURCHASED;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const updateMedCount = async (
  medcountData,
  oldMedcountData,
  medcountId,
  user
) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    // if some fields are not updated, then use the old data
    if (!medcountData.medicationId) {
      medcountData.medicationId = oldMedcountData.medicationId;
    }
    if (!medcountData.description) {
      medcountData.description = oldMedcountData.description;
    }
    if (!medcountData.medbought) {
      medcountData.medbought = oldMedcountData.medbought;
    }

    medcountData = {
      fcn: "UpdateMedCount",
      data: {
        id: medcountId,
        medicationId: medcountData.medicationId,
        medname: medcountData.description,
        medbought: medcountData.medbought,
        docType: BLOCKCHAIN_DOC_TYPE.MEDCOUNT,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      medcountData.fcn,
      JSON.stringify(medcountData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.MEDCOUNT) {
    //   prescription.status = PRESCRIPTION_STATUS.PURCHASED;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const deleteMedCount = async (medcountId, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    let medcountData = {
      fcn: "DeleteMedCount",
      data: medcountId,
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      medcountData.fcn,
      medcountData.data
    );

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const createAccessReq = async (accessReqData, prescriptionId, user) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    accessReqData = {
      fcn: "CreateAccessRequest",
      data: {
        id: getUUID(),
        prescriptionId: prescriptionId,
        assetType: accessReqData.assetType,
        permissionType: accessReqData.permissionType,
        accessStatus: ACCESS_STATUS.DENIED,
        docType: BLOCKCHAIN_DOC_TYPE.ACCESSREQ,
        createBy: user.email,
        updatedBy: user.email,
        createAt: dateTime,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      accessReqData.fcn,
      JSON.stringify(accessReqData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.MEDCOUNT) {
    //   prescription.status = PRESCRIPTION_STATUS.PURCHASED;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const updateAccessReq = async (
  accessReqData,
  oldAccessReqData,
  accessReqId,
  user
) => {
  let gateway;
  let client;
  try {
    // let isLastApproval =  await validateApprovals(agreementId, user)
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;

    // if some fields are not updated, then use the old data

    if (!accessReqData.prescriptionId) {
      accessReqData.prescriptionId = oldAccessReqData.prescriptionId;
    }
    if (!accessReqData.assetType) {
      accessReqData.assetType = oldAccessReqData.assetType;
    }
    if (!accessReqData.permissionType) {
      accessReqData.permissionType = oldAccessReqData.permissionType;
    }
    if (!accessReqData.accessStatus) {
      accessReqData.accessStatus = oldAccessReqData.accessStatus;
    }
    if (!accessReqData.createBy) {
      accessReqData.createBy = oldAccessReqData.createBy;
    }
    if (!accessReqData.createAt) {
      accessReqData.createAt = oldAccessReqData.createAt;
    }

    accessReqData = {
      fcn: "UpdateAccessRequest",
      data: {
        id: accessReqId,
        prescriptionId: accessReqData.prescriptionId,
        assetType: accessReqData.assetType,
        permissionType: accessReqData.permissionType,
        accessStatus: accessReqData.accessStatus,
        docType: BLOCKCHAIN_DOC_TYPE.ACCESSREQ,
        createBy: accessReqData.createBy,
        updatedBy: user.email,
        createAt: accessReqData.createAt,
        updatedAt: dateTime,
        orgId: parseInt(user.orgId),
        department: user.department,
      },
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      accessReqData.fcn,
      JSON.stringify(accessReqData.data)
    );

    // let prescription = await queryPrescriptionById(prescriptionId, user);
    // await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // if (prescription.status === PRESCRIPTION_STATUS.MEDCOUNT) {
    //   prescription.status = PRESCRIPTION_STATUS.PURCHASED;
    //   await contract.submitTransaction('CreatePrescription', JSON.stringify(prescription));
    // }

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const deleteAccessReq = async (accessReqId, user) => {
  let gateway;
  let client;
  try {
    let dateTime = new Date();
    let orgName = `org${user.orgId}`;
    let accessReqData = {

      fcn: "DeleteAccessRequest",
      data: accessReqId,
    };

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction(
      accessReqData.fcn,
      accessReqData.data
    );

    result = { txid: utf8Decoder.decode(result) };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }

};


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPrescriptions = async (filter) => {
  try {
    let query;
    console.log("==========================filter type", filter);
    if (filter?.filterType) {
      switch (filter.filterType) {
        case FILTER_TYPE.ALL:
          query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}`;

          break;
        case PRESCRIPTION_STATUS.PERSONALINFO:
          // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
          query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

          break;
        case PRESCRIPTION_STATUS.DIAGNOSIS:
          // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
          query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

          break;
        case PRESCRIPTION_STATUS.MEDICATION:
          // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
          query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

          break;
        case PRESCRIPTION_STATUS.MEDCOUNT:
          // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
          query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\",  \"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

          break;

        // case FILTER_TYPE.EXPIRING_SOON:
        //   // query = `{\"selector\":{{\"endDate\":{\"$lt\":${(+new Date())+THIRTY_DAYS}}}, \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
        //   query = `{\"selector\":{\"endDate\":{\"$lt\":${(+new Date())+THIRTY_DAYS}}, \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;

        //   break;
        // case FILTER_TYPE.INPROGRESS:
        //   query = `{\"selector\":{\"$or\":[{\"firstParty\":\"Org${filter.orgId}\"}, {\"secondParty\":\"Org${filter.orgId}\"}],\"status\":\"${filter.filterType}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"},  \"use_index\":[\"_design/status_doc_type_index\", \"status_doc_type_index\"]}`;
        //   console.log("-----------aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-------", query)
        //   break;

        default:
          query = `{\"selector\":{\"orgId\": ${filter.orgId},\"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
          break;
      }
    } else {
      query = `{\"selector\":{\"docType\": \"${BLOCKCHAIN_DOC_TYPE.PRESCRIPTION}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
    }
    // query = `{\"selector\":{\"orgId\": ${filter.orgId},\"status\":\"${filter.filterType}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexOrgDoc\", \"indexDoc\"]}}`;
    //  query = `{\"selector\":{\"orgId\": \"${filter.orgId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}, \"sort\":[{\"updatedAt\":\"desc\"}], \"use_index\":[\"_design/indexAssetTypeOrgIdTime\", \"orgId_docType_time_index\"]}}`;
    //  query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"docType\": \"${BLOCKCHAIN_DOC_TYPE.AGREEMENT}\"}}}`;
    console.log("filters--------------", filter, query);
    let data = await getPrescriptionsWithPagination(
      query,
      filter.pageSize,
      filter.bookmark,
      filter.orgName,
      filter.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
    );
    let tempData = [];
    for (let agreement of data?.data) {
      if (agreement?.Record?.document?.id) {
        let signedUrl = await getSignedUrl(
          agreement.Record.document.id,
          `org${agreement.Record.orgId}`
        );
        agreement.Record.document.url = signedUrl;
      }
      tempData.push(agreement);
    }
    data.data = tempData;
    return data;
  } catch (error) {
    console.log("error--------------", error);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPersonalInfosByPrescriptionId = async (filter) => {
  console.log(filter);
  let query = `{\"selector\":{\"prescriptionId\":\"${filter.prescriptionId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.PERSONALINFO}\"},  \"use_index\":[\"_design/indexDocTypePrescriptionId\", \"docType_prescriptionId_index\"]}}`;
  // let query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"}}}`;
  let data = await getPrescriptionsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  return data;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDiagnosesByPrescriptionId = async (filter) => {
  console.log(filter);
  let query = `{\"selector\":{\"prescriptionId\":\"${filter.prescriptionId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.DIAGNOSIS}\"},  \"use_index\":[\"_design/indexDocTypePrescriptionId\", \"docType_prescriptionId_index\"]}}`;
  // let query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"}}}`;
  let data = await getPrescriptionsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  return data;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMedicationsByPrescriptionId = async (filter) => {
  console.log(filter);
  let query = `{\"selector\":{\"prescriptionId\":\"${filter.prescriptionId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.MEDICATION}\"},  \"use_index\":[\"_design/indexDocTypePrescriptionId\", \"docType_prescriptiontId_index\"]}}`;
  // let query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"}}}`;

  let data = await getPrescriptionsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,

    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  let medications = data?.data?.map((elm) => elm.Record) || [];

  medications.forEach(async (element) => {
    let r = element;
    let filter2 = {
      pageSize: DEFAULT_MAX_RECORDS,
      bookmark: "",
      orgName: filter.orgName,
      email: filter.email,
      medicationId: element.id,
    };
    let medcounts = await queryMedCountsByMedicationId(filter2);
    r.medcounts = medcounts?.data?.map((elm) => elm.Record) || [];
    medications.push(r);

  });

  // let data = await getPrescriptionsWithPagination(
  //   query,
  //   filter.pageSize,
  //   filter.bookmark,
  //   filter.orgName,
  //   filter.email,

  //   NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
  //   NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  // );
  return data;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMedCountsByMedicationId = async (filter) => {
  console.log(filter);
  let query = `{\"selector\":{\"medicationId\":\"${filter.medicationId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.MEDCOUNT}\"},  \"use_index\":[\"_design/indexDocTypeMedicationId\", \"docType_medicationId_index\"]}}`;
  // let query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"}}}`;
  let data = await getPrescriptionsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  return data;
};


const queryAccessReqsByPrescriptionId = async (filter) => {
  console.log(filter);
  let query = `{\"selector\":{\"prescriptionId\":\"${filter.prescriptionId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.ACCESSREQ}\"},  \"use_index\":[\"_design/indexDocTypePrescriptionId\", \"docType_prescriptionId_index\"]}}`;
  // let query = `{\"selector\":{\"orgId\": ${filter.orgId}, \"agreementId\":\"${filter.agreementId}\", \"docType\": \"${BLOCKCHAIN_DOC_TYPE.APPROVAL}\"}}}`;
  let data = await getPrescriptionsWithPagination(
    query,
    filter.pageSize,
    filter.bookmark,
    filter.orgName,
    filter.email,
    NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
    NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME
  );
  return data;

};


const validateApprovals = async (agreementId, user) => {
  let orgName = `org${user.orgId}`;
  let filters = {
    pageSize: DEFAULT_MAX_RECORDS,
    bookmark: "",
    orgName: orgName,
    email: user.email,
    agreementId,
  };

  let approvals = await queryApprovalsByAgreementId(filters);
  if (approvals?.data?.length) {
    let orgDepartmentApproval = approvals.data.filter(
      (elm) =>
        elm?.Record?.department == user.department &&
        elm?.Record?.orgId == user.orgId
    );
    if (orgDepartmentApproval?.length) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Your department with name: ${user.department} has already approved this agreement`
      );
    } else if (approvals.data.length >= 3) {
      return true;
    }
  }
  return false;
};

const queryHistoryById = async (id, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;
    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction("getAssetHistory", id);
    // result = JSON.parse(result.toString());
    result = JSON.parse(utf8Decoder.decode(result));
    if (result) {
      result = result?.map((elm) => {
        return {
          txId: elm?.txId,
          IsDelete: elm.IsDelete,
          ...elm.Value,
          timeStamp: elm?.Timestamp?.seconds?.low * 1000,
        };
      });
    }
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const queryPrescriptionById = async (id, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction("getAssetById", id);
    console.timeEnd("Test");
    result = JSON.parse(utf8Decoder.decode(result));
    if (result) {
      result.document.url = await getSignedUrl(result?.document?.id, orgName);
    }
    let filter = {
      pageSize: DEFAULT_MAX_RECORDS,
      bookmark: "",
      orgName,
      email: user.email,
      prescriptionId: id,
    };

    let personalinfos = await queryPersonalInfosByPrescriptionId(filter);
    result.personalinfos = personalinfos?.data?.map((elm) => elm.Record) || [];
    let diagnoses = await queryDiagnosesByPrescriptionId(filter);
    result.diagnoses = diagnoses?.data?.map((elm) => elm.Record) || [];
    let medications = await queryMedicationsByPrescriptionId(filter);
    result.medications = medications?.data?.map((elm) => elm.Record) || [];
    let accessReqs = await queryAccessReqsByPrescriptionId(filter);
    result.accessReqs = accessReqs?.data?.map((elm) => elm.Record) || [];
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const queryMedicationById = async (id, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;

    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction("getAssetById", id);
    console.timeEnd("Test");
    result = JSON.parse(utf8Decoder.decode(result));
    // if (result) {
    //   result.document.url = await getSignedUrl(result?.document?.id, orgName);
    // }
    let filter = {
      pageSize: DEFAULT_MAX_RECORDS,
      bookmark: "",
      orgName,
      email: user.email,
      medicationId: id,
    };

    let medcounts = await queryMedCountsByMedicationId(filter);
    result.medcounts = medcounts?.data?.map((elm) => elm.Record) || [];

    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};


const querySubAssetById = async (id, user) => {
  let gateway;
  let client;
  try {
    let orgName = `org${user.orgId}`;
    const contract = await getContractObject(
      orgName,
      user.email,
      NETWORK_ARTIFACTS_DEFAULT.CHANNEL_NAME,
      NETWORK_ARTIFACTS_DEFAULT.CHAINCODE_NAME,
      gateway,
      client
    );
    let result = await contract.submitTransaction("getAssetById", id);
    console.timeEnd("Test");

    result = JSON.parse(utf8Decoder.decode(result));
    // if (result) {
    //   result.document.url = await getSignedUrl(result?.document?.id, orgName);
    // }
    // let filter = {
    //   pageSize: DEFAULT_MAX_RECORDS,
    //   bookmark: '',
    //   orgName,
    //   email: user.email,
    //   prescriptionId: id,
    // };

    // let personalinfos = await queryPersonalInfosByPrescriptionId(filter);
    // result.personalinfos = personalinfos?.data?.map((elm) => elm.Record) || [];
    // let diagnoses = await queryDiagnosesByPrescriptionId(filter);
    // result.diagnoses = diagnoses?.data?.map((elm) => elm.Record) || [];
    // let medications = await queryMedicationsByPrescriptionId(filter);
    // result.medications = medications?.data?.map((elm) => elm.Record) || [];
    // let medcounts = await queryMedCountsByPrescriptionId(filter);
    // result.medcounts = medcounts?.data?.map((elm) => elm.Record) || [];
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    if (gateway) {
      gateway.close();
    }
    if (client) {
      client.close();
    }
  }
};

const getDocSignedURL = async (docId, user) => {
  let orgName = `org${user.orgId}`;
  return getSignedUrl(docId, orgName);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

module.exports = {

  createPrescription,
  updatePrescription,
  queryPrescriptions,

  updatePersonalInfo,
  updateDiagnosis,
  updateMedication,
  updateMedCount,
  updateAccessReq,

  createPersonalInfo,
  createDiagnosis,
  createMedication,
  createMedCount,
  createAccessReq,

  deletePersonalInfo,
  deleteDiagnosis,
  deleteMedication,
  deleteMedCount,
  deleteAccessReq,

  queryPrescriptionById,
  queryMedicationById,
  querySubAssetById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  approveAgreement,

  queryPersonalInfosByPrescriptionId,
  queryDiagnosesByPrescriptionId,
  queryMedicationsByPrescriptionId,
  queryMedCountsByMedicationId,
  queryAccessReqsByPrescriptionId,

  getDocSignedURL,
  queryHistoryById,
};