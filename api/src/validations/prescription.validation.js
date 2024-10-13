const Joi = require("joi");
const {
  USER_DEPARTMENT,
  APPROVAL_STATUS,
  GENDER,
} = require("../utils/Constants");
const { password } = require("./custom.validation");

const createPrescription = Joi.object().keys({
  firstParty: Joi.string().required(),
  secondParty: Joi.string().required(),
  comment: Joi.string().required(),
});

const updatePrescription = Joi.object().keys({
  // id: Joi.string().required(),
  firstParty: Joi.string().required(),
  secondParty: Joi.string().required(),
  comment: Joi.string().required(),
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

module.exports = {
  createPrescription,
  createPersonalInfo,
  updatePersonalInfo,
  createDiagnosis,
  createMedication,
  createMedCount,
  updatePrescription,
  getPrescriptionById,
  getPrescriptionPersonalInfos,
  getPrescriptionDiagnoses,
  getPrescriptionMedications,
  getPrescriptionMedCounts,
  getSignedURL,
};
