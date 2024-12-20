"use strict";

const { Contract, Transaction } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;
const Access = require("./accesschaincode.js");

class Agreement extends Contract {
  async CreateContract(ctx, agreementData) {
    try {
      let agreement = JSON.parse(agreementData);
      await ctx.stub.putState(agreement.id, agreementData);
      // ctx.stub.SetEvent("CreateAsset", agreementData)
      return ctx.stub.getTxID();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async CreatePrescription(ctx, prescriptionData) {
    try {

      const access = new Access();
      access.CreatePrescriptionAccess(ctx);
      let prescription = JSON.parse(prescriptionData);
      await ctx.stub.putState(prescription.id, prescriptionData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreatePersonalInfo(ctx, personalData) {
    try {
      const access = new Access();
      access.CreatePersonalInfoAccess(ctx);

      let personal = JSON.parse(personalData);
      await ctx.stub.putState(personal.id, personalData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateDiagnosis(ctx, diagnosisData) {
    try {
      const access = new Access();
      access.CreateDiagnosisAccess(ctx);

      let diagnosis = JSON.parse(diagnosisData);
      await ctx.stub.putState(diagnosis.id, diagnosisData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateMedication(ctx, medicationData) {
    try {
      const access = new Access();
      access.CreateMedicationAccess(ctx);

      let medication = JSON.parse(medicationData);
      await ctx.stub.putState(medication.id, medicationData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateMedCount(ctx, countData) {
    try {
      const access = new Access();
      access.CreateMedCountAccess(ctx);

      let count = JSON.parse(countData);
      await ctx.stub.putState(count.id, countData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateAccessRequest(ctx, requestData) {
    try {
      const access = new Access();
      access.CreateAccessRequestAccess(ctx);

      let requestInfo = JSON.parse(requestData);
      await ctx.stub.putState(requestInfo.id, requestData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }



  async UpdatePrescription(ctx, prescriptionData) {
    try {
      const access = new Access();
      access.UpdatePrescriptionAccess(ctx,prescriptionData);

      let updatedprescription = JSON.parse(prescriptionData);
      await ctx.stub.putState(updatedprescription.id, prescriptionData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async UpdatePersonalInfo(ctx, personalInfoData) {
    try {
      const access = new Access();
      access.UpdatePersonalInfoAccess(ctx);

      let updatedPersonalInfo = JSON.parse(personalInfoData);
      await ctx.stub.putState(updatedPersonalInfo.id, personalInfoData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async UpdateDiagnosis(ctx, personalInfoData) {
    try {
      const access = new Access();
      access.UpdateDiagnosisAccess(ctx);

      let updatedPersonalInfo = JSON.parse(personalInfoData);
      await ctx.stub.putState(updatedPersonalInfo.id, personalInfoData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async UpdateMedication(ctx, personalInfoData) {
    try {
      const access = new Access();
      access.UpdateMedicationAccess(ctx);

      let updatedPersonalInfo = JSON.parse(personalInfoData);
      await ctx.stub.putState(updatedPersonalInfo.id, personalInfoData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async UpdateMedCount(ctx, personalInfoData) {
    try {
      const access = new Access();
      access.UpdateMedCountAccess(ctx);

      let updatedPersonalInfo = JSON.parse(personalInfoData);
      await ctx.stub.putState(updatedPersonalInfo.id, personalInfoData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async UpdateAccessRequest(ctx, requestData) {
    try {
      const access = new Access();
      access.UpdateAccessRequestAccess(ctx);

      let request = JSON.parse(requestData);
      await ctx.stub.putState(request.id, requestData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async DeletePrescription(ctx, prescriptionId) {
    try {
      await ctx.stub.deleteState(prescriptionId);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async DeletePersonalInfo(ctx, personalInfoId) {
    try {
      const access = new Access();
      access.DeletePersonalInfoAccess(ctx);

      await ctx.stub.deleteState(personalInfoId);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async DeleteDiagnosis(ctx, diagnosisId) {
    try {
      const access = new Access();
      access.DeleteDiagnosisAccess(ctx);

      await ctx.stub.deleteState(diagnosisId);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async DeleteMedication(ctx, medicationId) {
    try {
      const access = new Access();
      access.DeleteMedicationAccess(ctx);

      await ctx.stub.deleteState(medicationId);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async DeleteMedCount(ctx, medCountId) {
    try {
      const access = new Access();
      access.DeleteMedCountAccess(ctx);

      await ctx.stub.deleteState(medCountId);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async DeleteAccessRequest(ctx, requestId) {
    try {
      // const access = new Access();
      // access.DeleteAccessRequestAccess(ctx);

      await ctx.stub.deleteState(requestId);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async getAssetById(ctx, id) {
    try {
      const assetJSON = await ctx.stub.getState(id);
      if (!assetJSON || assetJSON.length === 0) {
        throw new Error(`The asset ${id} does not exist`);
      }
      return assetJSON.toString();
    } catch (err) {
      throw new Error(err.stack);
    }
  }

  async assetExists(ctx, id) {
    try {
      const assetJSON = await ctx.stub.getState(id);
      return assetJSON && assetJSON.length > 0;
    } catch (err) {
      return new Error(err.stack);
    }
  }

  async getAllResults(iterator, isHistory) {
    try {
      let allResults = [];
      while (true) {
        let res = await iterator.next();
        console.log(res.value);

        if (res.value && res.value.value.toString()) {
          let jsonRes = {};
          console.log(res.value.value.toString("utf8"));

          if (isHistory && isHistory === true) {
            jsonRes.txId = res.value.txId;
            jsonRes.Timestamp = res.value.timestamp;
            jsonRes.IsDelete = res.value.is_delete
              ? res.value.is_delete.toString()
              : "false";
            try {
              jsonRes.Value = JSON.parse(res.value.value.toString("utf8"));
            } catch (err) {
              console.log(err);
              jsonRes.Value = res.value.value.toString("utf8");
            }
          } else {
            jsonRes.Key = res.value.key;
            try {
              jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
            } catch (err) {
              console.log(err);
              jsonRes.Record = res.value.value.toString("utf8");
            }
          }
          allResults.push(jsonRes);
        }
        if (res.done) {
          console.log("end of data");
          await iterator.close();
          console.info("allResults : ", allResults);
          return allResults;
        }
      }
    } catch (err) {
      return new Error(err.message);
    }
  }

  async getAssetHistory(ctx, id) {
    try {
      let resultsIterator = await ctx.stub.getHistoryForKey(id);
      let results = await this.getAllResults(resultsIterator, true);
      console.log("results : ", results);

      return results;
    } catch (err) {
      return new Error(err.stack);
    }
  }

  async getDataWithPagination(ctx, queryString, pageSize, bookmark) {
    try {
      const pageSizeInt = parseInt(pageSize, 10);
      const { iterator, metadata } =
        await ctx.stub.getQueryResultWithPagination(
          queryString,
          pageSizeInt,
          bookmark
        );
      const results = await this.getAllResults(iterator, false);
      let finalData = {
        data: results,
        metadata: {
          RecordsCount: metadata.fetchedRecordsCount,
          Bookmark: metadata.bookmark,
        },
      };
      return finalData;
    } catch (err) {
      return new Error(err.message);
    }
  }
}

module.exports = Agreement;
