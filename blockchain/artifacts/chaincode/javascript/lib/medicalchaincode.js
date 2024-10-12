"use strict";

const { Contract, Transaction } = require("fabric-contract-api");
const ClientIdentity = require("fabric-shim").ClientIdentity;

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
      let prescription = JSON.parse(prescriptionData);
      await ctx.stub.putState(prescription.id, prescriptionData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreatePersonalInfo(ctx, personalData) {
    try {
      let cid = new ClientIdentity(ctx.stub);
      if (!cid.assertAttributeValue("department", "patient")) {
        throw new Error(
          "You are not authorized to perform this operation, Only patient can do this operation"
        );
      }
      let personal = JSON.parse(personalData);
      await ctx.stub.putState(personal.id, personalData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateDiagnosis(ctx, diagnosisData) {
    try {
      let cid = new ClientIdentity(ctx.stub);
      if (!cid.assertAttributeValue("department", "doctor")) {
        throw new Error(
          "You are not authorized to perform this operation, Only doctor can do this operation"
        );
      }
      let diagnosis = JSON.parse(diagnosisData);
      await ctx.stub.putState(diagnosis.id, diagnosisData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateMedication(ctx, medicationData) {
    try {
      let cid = new ClientIdentity(ctx.stub);
      if (!cid.assertAttributeValue("department", "doctor")) {
        throw new Error(
          "You are not authorized to perform this operation, Only doctor can do this operation"
        );
      }
      let medication = JSON.parse(medicationData);
      await ctx.stub.putState(medication.id, medicationData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async CreateMedCount(ctx, countData) {
    try {
      let cid = new ClientIdentity(ctx.stub);
      if (!cid.assertAttributeValue("department", "pharmacist")) {
        throw new Error(
          "You are not authorized to perform this operation, Only pharmacist can do this operation"
        );
      }
      let count = JSON.parse(countData);
      await ctx.stub.putState(count.id, countData);
      return ctx.stub.getTxID();
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async UpdatePrescription(ctx, prescriptionData) {}

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
