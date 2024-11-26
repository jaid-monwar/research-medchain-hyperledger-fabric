const Joi = require("joi");
const {
  USER_DEPARTMENT,
  APPROVAL_STATUS,
  GENDER,
  ACCESS_STATUS,
  PERMISSION_TYPE,
  BLOCKCHAIN_DOC_TYPE,
} = require("../utils/Constants");
const { password } = require("./custom.validation");

const createPrescription = Joi.object().keys({
  firstParty: Joi.string().required(),
  secondParty: Joi.string().required(),
  comment: Joi.string().required(),
  institutionType: Joi.string().required(),
  location: Joi.string().required(),
});

const updatePrescription = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getPrescriptionsByDate = Joi.object().keys({
  // id: Joi.string().required(),
  createAt: Joi.string().required(),
  //secondParty: Joi.string().required(),
  //comment: Joi.string().required(),
});

const getPrescriptionsByStatus = Joi.object().keys({
  // id: Joi.string().required(),
  //createAt: Joi.string().required(),
  //secondParty: Joi.string().required(),
  //comment: Joi.string().required(),
});

const createPersonalInfo = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    age: Joi.string().required(),
    gender: Joi.string()
      .required()
      .valid(GENDER.MALE, GENDER.FEMALE, GENDER.OTHER),
    address: Joi.string().required(),
    phone: Joi.string().required(),
  }),
};

const updatePersonalInfo = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateAccessReq = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const createDiagnosis = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    comment: Joi.string().required(),
  }),
};

const createMedication = {
  body: Joi.object().keys({
    medname: Joi.string().required(),
    meddosage: Joi.string().required(),
    medcount: Joi.string().required(),
    comment: Joi.string().required(),
  }),
};

const createMedCount = {
  body: Joi.object().keys({
    medbought: Joi.string().required(),
  }),
};

const createAccessReq = {
  body: Joi.object().keys({
    // asset type can be personal info, diagnosis, medication, medcount
    assetType: Joi.string()
      .required()
      .valid(
        BLOCKCHAIN_DOC_TYPE.PERSONALINFO,
        BLOCKCHAIN_DOC_TYPE.DIAGNOSIS,
        BLOCKCHAIN_DOC_TYPE.MEDICATION,
        BLOCKCHAIN_DOC_TYPE.MEDCOUNT
      ),
    // permission type can be read, update, delete
    permissionType: Joi.string()
      .required()
      .valid(
        PERMISSION_TYPE.READ,
        PERMISSION_TYPE.UPDATE,
        PERMISSION_TYPE.DELETE
      ),
  }),
};

const getPrescriptionById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getSignedURL = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getPrescriptionPersonalInfos = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const getPrescriptionDiagnoses = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
const getPrescriptionMedications = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
const getPrescriptionMedCounts = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
const getPrescriptionAccessReqs = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createPrescription,

  createPersonalInfo,
  updatePersonalInfo,

  createDiagnosis,
  createMedication,
  createMedCount,

  createAccessReq,
  updateAccessReq,


  updatePrescription,
  getPrescriptionById,
  getPrescriptionsByDate,
  getPrescriptionsByStatus,

  getPrescriptionPersonalInfos,


  getPrescriptionDiagnoses,
  getPrescriptionMedications,
  getPrescriptionMedCounts,
  getPrescriptionAccessReqs,

  getSignedURL,
};
