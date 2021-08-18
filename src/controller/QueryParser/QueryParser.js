"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DatasetKey_1 = require("./DatasetKey");
const DisplayKey_1 = require("./DisplayKey");
const FilterKey_1 = require("./FilterKey");
const OrderKey_1 = require("./OrderKey");
class QueryParser {
    constructor(query) {
        this.getQuery = function () {
            return this.query;
        };
        this.getDatasetKey = function () {
            return this.datasetKey;
        };
        this.getFilterKey = function () {
            return this.filterKey;
        };
        this.getDisplayKey = function () {
            return this.displayKey;
        };
        this.getOrderKey = function () {
            if (this.orderKey !== null && this.orderKey !== undefined) {
                return this.orderKey;
            }
        };
        this.TestValidQuery = function (query) {
            let firstChunk;
            let secondChunk;
            if (query === "") {
                throw new Error("invalid query: query is blank");
            }
            if (query === null) {
                throw new Error("invalid query: query is null");
            }
            if (query === undefined) {
                throw new Error("invalid query: query is undefined");
            }
            firstChunk = query.split(";");
            secondChunk = firstChunk[0].split(" ");
            if (firstChunk.length !== 3 && firstChunk.length !== 2) {
                throw new Error("invalid query syntax: ensure that ';' is only used in the correct locations");
            }
            if (secondChunk.length < 4) {
                throw new Error("invalid QUERY: ensure that DATASET and FILTER keys are correctly formatted");
            }
        };
        this.SplitQueryIntoKeys = function (query) {
            const firstChunk = query.split(";");
            const secondChunk = firstChunk[0].split(" ");
            if (secondChunk.length < 4) {
                throw new Error("invalid QUERY: are you missing any keys?");
            }
            const datasetKeyValues = secondChunk.slice(0, 4);
            const filterKeyValues = secondChunk.slice(4, secondChunk.length);
            const finalKey = firstChunk[firstChunk.length - 1];
            const displayKeyValues = firstChunk[1].split(" ");
            displayKeyValues.shift();
            try {
                this.datasetKey = new DatasetKey_1.DatasetKey(datasetKeyValues);
            }
            catch (error) {
                throw error;
            }
            try {
                this.filterKey = new FilterKey_1.FilterKey(filterKeyValues);
            }
            catch (error) {
                throw error;
            }
            try {
                this.displayKey = new DisplayKey_1.DisplayKey(displayKeyValues);
            }
            catch (error) {
                throw error;
            }
            if (firstChunk.length === 3) {
                const removePeriodValues = finalKey.split(".");
                const orderKeyValues = removePeriodValues[0].split(" ");
                orderKeyValues.shift();
                try {
                    this.orderKey = new OrderKey_1.OrderKey(orderKeyValues);
                }
                catch (error) {
                    throw error;
                }
            }
        };
        this.query = query.split(" ");
        try {
            this.TestValidQuery(query);
        }
        catch (error) {
            throw error;
        }
        try {
            this.SplitQueryIntoKeys(query);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.QueryParser = QueryParser;
//# sourceMappingURL=QueryParser.js.map