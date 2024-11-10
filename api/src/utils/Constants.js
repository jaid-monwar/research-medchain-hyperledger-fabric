const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OTHER: "other",
};

const USER_ACCESS = {
  GRANT: "grant",
  REVOKE: "revoke",
};

const USER_TYPE = {
  ADMIN: "admin",
  USER: "user",
};

const ORG_DEFAULT_USER = {
  ADMIN: "admin",
};

const BLOCKCHAIN_DOC_TYPE = {
  PRESCRIPTION: "prescription",
  PERSONALINFO: "personalinfo",
  DIAGNOSIS: "diagnosis",
  MEDICATION: "medication",
  MEDCOUNT: "medcount",
  ACCESSREQ: "accessreq",
};

const FILTER_TYPE = {
  COMPLETED: "completed",
  EXPIRING_SOON: "expiring-soon",
  INPROGRESS: "inprogress",
  ALL: "all",
  ACTIVE: "active",
};

// Be careful here
const NETWORK_ARTIFACTS_DEFAULT = {
  CHANNEL_NAME: "mychannel",
  CHAINCODE_NAME: "medicalchaincode",
  QSCC: "qscc",
};

const ORG_DEPARTMENT = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  PHARMACIST: "pharmacist",
};

const CHAINCODE_METHODS = {
  CREATE_AGREEMENT: "",
  APPROVE_AGREEMENT: "",
  GET_ASSET_BY_ID: "",
  GET_ASSET_HISTORY: "",
  GET_APPROVALS: "",
};

const PRESCRIPTION_STATUS = {
  PERSONALINFO: "personalinfo",
  DIAGNOSIS: "diagnosis",
  MEDICATION: "medication",
  MEDCOUNT: "medcount",
  PURCHASED: "purchased",
};
const APPROVAL_STATUS = {
  APPROVED: "approved",
  REJECTED: "rejected",
  OTHER: "other",
};

const ACCESS_STATUS = {
  DENIED: "denied",
  GRANTED: "granted",
};

const PERMISSION_TYPE = {
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

module.exports = {
  GENDER,
  USER_STATUS,
  USER_ACCESS,
  USER_TYPE,
  ORG_DEPARTMENT,
  NETWORK_ARTIFACTS_DEFAULT,
  PERMISSION_TYPE,
  ACCESS_STATUS,
  BLOCKCHAIN_DOC_TYPE,
  CHAINCODE_METHODS,
  PRESCRIPTION_STATUS,
  APPROVAL_STATUS,
  FILTER_TYPE,
};
