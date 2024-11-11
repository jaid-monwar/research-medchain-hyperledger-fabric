"use strict";

const medicalchaincode = require("./lib/medicalchaincode");

module.exports.AssetTransfer = medicalchaincode;
module.exports.contracts = [medicalchaincode];
