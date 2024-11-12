const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService, prescriptionService } = require("../services");
const { getPagination } = require("../utils/pagination");
const { getSuccessResponse } = require("../utils/Response");

const createPrescription = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let fileMetadata = req.body.fileMetadata;
  console.log("============user========", user);
  if (user.department !== "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to submit diagnosis form"
    );
  }
  const result = await prescriptionService.createPrescription(
    req.body,
    fileMetadata,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "Prescription created successfully",
        result
      )
    );
});

const updatePrescription = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  // let fileMetadata = req.body.fileMetadata;
  let prescriptionData = req.body;
  if (user.department !== "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update this prescription"
    );
  }
  const result = await prescriptionService.updatePrescription(
    id,
    prescriptionData,
    user
  );
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Prescription updated successfully",
        result
      )
    );
});

const approveAgreement = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let approvalData = req.body;
  let agreementId = req.params.id;
  const result = await agreementService.approveAgreement(
    approvalData,
    agreementId,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "approval submitted successfully",
        result
      )
    );
});




const createPersonalInfo = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let personalinfoData = req.body;
  let prescriptionId = req.params.id;
  if (user.department !== "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to submit personal info form"
    );
  }
  const result = await prescriptionService.createPersonalInfo(
    personalinfoData,
    prescriptionId,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "Personal Info form submitted successfully",
        result
      )
    );
});

const updatePersonalInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  let personalInfoData = req.body;
  if (user.department !== "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update personal info"
    );
  }
  const oldPersonalInfoData = await prescriptionService.querySubAssetById(
    id,
    user
  );
  // console.log("oldPersonalInfoData", oldPersonalInfoData);
  const result = await prescriptionService.updatePersonalInfo(
    personalInfoData,
    oldPersonalInfoData,
    id,
    user
  );
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Personal Info updated successfully",
        result
      )
    );
});

const deletePersonalInfo = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  if (user.department !== "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to delete personal info"
    );
  }
  const result = await prescriptionService.deletePersonalInfo(id, user);
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Personal Info deleted successfully",
        result
      )
    );
});

const createDiagnosis = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let diagnosisData = req.body;
  let prescriptionId = req.params.id;
  // if (user.department !== 'doctor') {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to submit diagnosis form');
  // }
  const result = await prescriptionService.createDiagnosis(
    diagnosisData,
    prescriptionId,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "Medication form submitted successfully",
        result
      )
    );
});
const updateDiagnosis = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  let diagnosisData = req.body;
  if (user.department !== "doctor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update diagnosis"
    );
  }
  const oldDiagnosisData = await prescriptionService.querySubAssetById(
    id,
    user
  );
  const result = await prescriptionService.updateDiagnosis(
    diagnosisData,
    oldDiagnosisData,
    id,
    user
  );
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Diagnosis updated successfully",
        result
      )
    );
});
const deleteDiagnosis = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  if (user.department !== "doctor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to delete diagnosis"
    );
  }
  const result = await prescriptionService.deleteDiagnosis(id, user);
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Diagnosis deleted successfully",
        result
      )
    );
});

const createMedication = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let medicationData = req.body;
  let prescriptionId = req.params.id;
  if (user.department !== "doctor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to submit medication form"
    );
  }
  const result = await prescriptionService.createMedication(
    medicationData,
    prescriptionId,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "Medication form submitted successfully",
        result
      )
    );
});

const updateMedication = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  let medicationData = req.body;
  if (user.department !== "doctor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update medication"
    );
  }
  const oldMedicationData = await prescriptionService.querySubAssetById(
    id,
    user
  );
  const result = await prescriptionService.updateMedication(
    medicationData,
    oldMedicationData,
    id,
    user
  );
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "medication updated successfully",
        result
      )
    );
});

const deleteMedication = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  if (user.department !== "doctor") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to delete medication"
    );
  }
  const result = await prescriptionService.deleteMedication(id, user);
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Medication deleted successfully",
        result
      )
    );
});

const createMedCount = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let medcountData = req.body;
  let medicationId = req.params.id;
  if (user.department !== "pharmacist") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to submit medcount form"
    );
  }
  const result = await prescriptionService.createMedCount(
    medcountData,
    medicationId,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "Medcount form submitted successfully",
        result
      )
    );
});
const updateMedCount = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  let medcountData = req.body;
  if (user.department !== "pharmacist") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update medcount"
    );
  }
  const oldMedCountData = await prescriptionService.querySubAssetById(id, user);
  const result = await prescriptionService.updateMedCount(
    medcountData,
    oldMedCountData,
    id,
    user
  );
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(httpStatus.OK, "Medcount updated successfully", result)
    );
});
const deleteMedCount = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  if (user.department !== "pharmacist") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to delete medcount"
    );
  }
  const result = await prescriptionService.deleteMedCount(id, user);
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(httpStatus.OK, "Medcount deleted successfully", result)
    );
});


const createAccessReq = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let accessReqData = req.body;
  let prescriptionId = req.params.id;
  if (user.department === "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to submit access request"
    );
  }
  const result = await prescriptionService.createAccessReq(
    accessReqData,
    prescriptionId,
    user
  );
  res
    .status(httpStatus.CREATED)
    .send(
      getSuccessResponse(
        httpStatus.CREATED,
        "Access request submitted successfully",
        result
      )
    );
});

const updateAccessReq = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  let accessReqData = req.body;
  if (user.department !== "patient") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update access request"
    );
  }
  const oldAccessReqData = await prescriptionService.querySubAssetById(
    id,
    user
  );
  const result = await prescriptionService.updateAccessReq(
    accessReqData,
    oldAccessReqData,
    id,
    user
  );
  res
    .status(httpStatus.OK)
    .send(

      getSuccessResponse(
        httpStatus.OK,
        "Access request updated successfully",
        result
      )

    );
});

const deleteAccessReq = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { user } = req.loggerInfo;
  const result = await prescriptionService.deleteAccessReq(id, user);
  res
    .status(httpStatus.OK)
    .send(

      getSuccessResponse(
        httpStatus.OK,
        "Access request deleted successfully",
        result
      )
    );
});


const getSignedURL = catchAsync(async (req, res) => {
  let { user } = req.loggerInfo;
  let docId = req.params.id;
  let url = await prescriptionService.getDocSignedURL(docId, user);
  res.status(httpStatus.OK).send(
    getSuccessResponse(httpStatus.OK, "Signed URL fetched successfully", {
      signedURL: url,
      docId,
    })
  );
});

const getPrescriptions = catchAsync(async (req, res) => {
  const { pageSize, bookmark, filterType } = req.query;

  let { orgId, email } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || 10,
    bookmark: bookmark || "",
    orgName,
    email,
    filterType,
  };

  

  console.log(filter);

  let data = await prescriptionService.queryPrescriptions(filter);
  if (data?.data) {
    data.data = data.data.map((elm) => elm.Record);
  }

  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(httpStatus.OK, "Users fetched successfully", data)
    );
});

const getPrescriptionsByDate = catchAsync(async (req, res) => {
  const { date } = req.body; // Only the date (YYYY-MM-DD) is expected in the request body
  console.log(date);

  // Parse the date to get the start and end timestamps in ISO format
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  console.log(startOfDay);
  console.log(endOfDay);

  // Extract other pagination parameters if needed
  const { pageSize, bookmark } = req.body;

  // Extract user info from req.loggerInfo
  let { orgId, email } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  // Construct the filter to pass to the service function
  let filter = {
    startOfDay,
    endOfDay,
    pageSize: pageSize || 10, // Default pageSize to 10 if not provided
    bookmark: bookmark || "", // Bookmark for pagination, if provided
    orgName,
    email
  };

  console.log("Filter for date range:", filter);

  // Call the service function with the filter
  let data = await prescriptionService.queryPrescriptionsByDateRange(filter);
  if (data?.data) {
    data.data = data.data.map((elm) => elm.Record);
  }

  // Send the response
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(httpStatus.OK, "Prescriptions fetched successfully", data)
    );
});


const getHistoryById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req.loggerInfo;
  let data = await agreementService.queryHistoryById(id, user);

  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(httpStatus.OK, "Agreement fetched successfully", data)
    );
});

const getApprovalsByAgreementId = catchAsync(async (req, res) => {
  const { pageSize, bookmark } = req.query;
  const agreementId = req.params.id;
  let { orgId, email } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || "10",
    bookmark: bookmark || "",
    orgName,
    email,
    agreementId,
  };

  let data = await agreementService.queryApprovalsByAgreementId(filter);
  data = data.data.map((elm) => elm.Record);
  res.status(httpStatus.OK).send(
    getSuccessResponse(httpStatus.OK, "Users fetched successfully", {
      approvals: data,
    })
  );
});




const getPersonalInfosByPrescriptionId = catchAsync(async (req, res) => {
  const { pageSize, bookmark } = req.query;
  const prescriptionId = req.params.id;
  let { orgId, email } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || "10",
    bookmark: bookmark || "",
    orgName,
    email,
    prescriptionId,
  };

  let data = await prescriptionService.queryPersonalInfosByPrescriptionId(
    filter
  );
  data = data.data.map((elm) => elm.Record);
  res.status(httpStatus.OK).send(
    getSuccessResponse(httpStatus.OK, "Personal Info fetched successfully", {
      personalinfos: data,
    })
  );
});

const getDiagnosesByPrescriptionId = catchAsync(async (req, res) => {
  const { pageSize, bookmark } = req.query;
  const prescriptionId = req.params.id;
  let { orgId, email, department } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || "10",
    bookmark: bookmark || "",
    orgName,
    email,
    prescriptionId,
  };
  // if (department !== 'doctor' || department !== 'patient') {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this form');
  // }

  let data = await prescriptionService.queryDiagnosesByPrescriptionId(filter);
  data = data.data.map((elm) => elm.Record);
  res.status(httpStatus.OK).send(
    getSuccessResponse(httpStatus.OK, "Diagnosis fetched successfully", {
      diagnoses: data,
    })
  );
});

const getMedicationsByPrescriptionId = catchAsync(async (req, res) => {
  const { pageSize, bookmark } = req.query;
  const prescriptionId = req.params.id;
  let { orgId, email, department } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || "10",
    bookmark: bookmark || "",
    orgName,
    email,
    prescriptionId,
  };
  // if (department !== 'doctor') {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this form');
  // }

  let data = await prescriptionService.queryMedicationsByPrescriptionId(filter);
  data = data.data.map((elm) => elm.Record);
  res.status(httpStatus.OK).send(
    getSuccessResponse(httpStatus.OK, "Medications fetched successfully", {
      medications: data,
    })
  );
});

const getMedCountsByMedicationId = catchAsync(async (req, res) => {
  const { pageSize, bookmark } = req.query;
  const medicationId = req.params.id;
  let { orgId, email, department } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || "10",
    bookmark: bookmark || "",
    orgName,
    email,
    medicationId,
  };
  // if (department !== 'pharmacist') {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this form');
  // }

  let data = await prescriptionService.queryMedCountsByMedicationId(filter);
  data = data.data.map((elm) => elm.Record);
  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Medication Counts fetched successfully",
        { medcounts: data }
      )
    );
});

const getAccessReqsByPrescriptionId = catchAsync(async (req, res) => {
  const { pageSize, bookmark } = req.query;
  const prescriptionId = req.params.id;
  let { orgId, email, department } = req.loggerInfo.user;
  let orgName = `org${orgId}`;

  let filter = {
    orgId: parseInt(req.loggerInfo.user.orgId),
    pageSize: pageSize || "10",
    bookmark: bookmark || "",
    orgName,
    email,
    prescriptionId,
  };
  // if (department !== 'patient') {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to access this form');
  // }

  let data = await prescriptionService.queryAccessReqsByPrescriptionId(filter);
  data = data.data.map((elm) => elm.Record);
  res.status(httpStatus.OK).send(
    getSuccessResponse(httpStatus.OK, "Access Requests fetched successfully", {
      accessreqs: data,
    })
  );
});


const getPrescriptionById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req.loggerInfo;
  let data = await prescriptionService.queryPrescriptionById(id, user);

  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Prescription fetched successfully",
        data
      )
    );
});

const getMedicationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req.loggerInfo;
  let data = await prescriptionService.queryMedicationById(id, user);

  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(
        httpStatus.OK,
        "Prescription fetched successfully",
        data
      )
    );
});




const getSubAssetById = catchAsync(async (req, res) => {
  const { id } = req.params;

  let { user } = req.loggerInfo;
  let data = await prescriptionService.querySubAssetById(id, user);

  res
    .status(httpStatus.OK)
    .send(
      getSuccessResponse(httpStatus.OK, "Sub asset fetched successfully", data)
    );
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res
    .status(httpStatus.OK)
    .send(getSuccessResponse(httpStatus.OK, "User fetched successfully", user));
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPrescription,
  updatePrescription,

  createPersonalInfo,
  updatePersonalInfo,
  deletePersonalInfo,

  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,

  createMedication,
  updateMedication,
  deleteMedication,

  createMedCount,
  updateMedCount,
  deleteMedCount,

  createAccessReq,
  updateAccessReq,
  deleteAccessReq,

  getPrescriptions,
  getPrescriptionsByDate,
  getUser,
  updateUser,
  deleteUser,
  getPrescriptionById,
  getMedicationById,
  getSubAssetById,
  approveAgreement,


  getPersonalInfosByPrescriptionId,
  getDiagnosesByPrescriptionId,
  getMedicationsByPrescriptionId,
  getMedCountsByMedicationId,
  getAccessReqsByPrescriptionId,
  getSignedURL,
  getHistoryById,
};
