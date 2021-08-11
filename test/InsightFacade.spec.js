"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const IInsightFacade_1 = require("../src/controller/IInsightFacade");
const InsightFacade_1 = require("../src/controller/InsightFacade");
const Util_1 = require("../src/Util");
const TestUtil_1 = require("./TestUtil");
describe("InsightFacade Add/Remove Dataset", function () {
    const datasetsToLoad = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
        courses2: "./test/data/courses.zip",
        emptydataset: "./test/data/emptydataset.zip",
        onevalidcsv: "./test/data/onevalidcsv.zip",
        oneinvalidcsv: "./test/data/oneinvalidcsv.zip",
        oneinvalidname: "./test/data/oneinvalidname.zip",
    };
    let insightFacade;
    let datasets;
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`Before: ${this.test.parent.title}`);
            try {
                const loadDatasetPromises = [];
                for (const [id, path] of Object.entries(datasetsToLoad)) {
                    loadDatasetPromises.push(TestUtil_1.default.readFileAsync(path));
                }
                const loadedDatasets = (yield Promise.all(loadDatasetPromises)).map((buf, i) => {
                    return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
                });
                datasets = Object.assign({}, ...loadedDatasets);
                chai_1.expect(Object.keys(datasets)).to.have.length.greaterThan(0);
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
            }
            try {
                insightFacade = new InsightFacade_1.default();
            }
            catch (err) {
                Util_1.default.error(err);
            }
            finally {
                chai_1.expect(insightFacade).to.be.instanceOf(InsightFacade_1.default);
            }
        });
    });
    beforeEach(function () {
        Util_1.default.test(`BeforeTest: ${this.currentTest.title}`);
    });
    after(function () {
        Util_1.default.test(`After: ${this.test.parent.title}`);
    });
    afterEach(function () {
        Util_1.default.test(`AfterTest: ${this.currentTest.title}`);
    });
    it("Should add a valid dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 204;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should add a valid dataset with 1 csv file with a course but 0 rows", () => __awaiter(this, void 0, void 0, function* () {
        const id = "onevalidcsv";
        const expectedCode = 204;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject an id that was previously added", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a dataset when the id parameter has a space", () => __awaiter(this, void 0, void 0, function* () {
        const id = "cour ses";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a dataset when the id parameter has an underscore", () => __awaiter(this, void 0, void 0, function* () {
        const id = "cour_ses";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a dataset if it does not have at least one valid csv file in it", () => __awaiter(this, void 0, void 0, function* () {
        const id = "emptydataset";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a dataset if it does not have a valid course name", () => __awaiter(this, void 0, void 0, function* () {
        const id = "oneinvalidname";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a dataset if it only contains a blank csv", () => __awaiter(this, void 0, void 0, function* () {
        const id = "oneinvalidcsv";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a null ID", () => __awaiter(this, void 0, void 0, function* () {
        const id = null;
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject an undefined ID", () => __awaiter(this, void 0, void 0, function* () {
        const id = undefined;
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a non-existent content", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        const badPath = "good53675678845morning2457457sir";
        try {
            response = yield insightFacade.addDataset(id, badPath, IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should allow two courses to have the same content path", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const id2 = "courses2";
        const expectedCode = 204;
        let response;
        yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        try {
            response = yield insightFacade.addDataset(id2, datasets[id2], IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a null content value", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        const badPath = null;
        try {
            response = yield insightFacade.addDataset(id, badPath, IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject an undefined content value", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        const badPath = undefined;
        try {
            response = yield insightFacade.addDataset(id, badPath, IInsightFacade_1.InsightDatasetKind.Courses);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject the rooms InsightDataSetKind", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Rooms);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject a null InsightDataSetKind", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], null);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should reject an undefined InsightDataSetKind", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 400;
        let response;
        try {
            response = yield insightFacade.addDataset(id, datasets[id], undefined);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should remove the courses dataset", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 204;
        let response;
        yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should fail to remove courses dataset after it is already removed", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 404;
        let response;
        yield insightFacade.addDataset(id, datasets[id], IInsightFacade_1.InsightDatasetKind.Courses);
        yield insightFacade.removeDataset(id);
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should fail to remove dataset with an id that has a space", () => __awaiter(this, void 0, void 0, function* () {
        const id = "courses";
        const expectedCode = 404;
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should fail to remove dataset with an id that has a space", () => __awaiter(this, void 0, void 0, function* () {
        const id = "cour ses";
        const expectedCode = 404;
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should fail to remove dataset with an id that has an underscore", () => __awaiter(this, void 0, void 0, function* () {
        const id = "cour_ses";
        const expectedCode = 404;
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should fail to remove courses dataset with a null id", () => __awaiter(this, void 0, void 0, function* () {
        const id = null;
        const expectedCode = 404;
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
    it("Should fail to remove courses dataset with an undefined id", () => __awaiter(this, void 0, void 0, function* () {
        const id = undefined;
        const expectedCode = 404;
        let response;
        try {
            response = yield insightFacade.removeDataset(id);
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
        }
    }));
});
describe("InsightFacade pre-adding a dataset to test Add/Remove Dataset", function () {
    const datasetsToLoad = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
    };
    let insightFacade;
    let datasets;
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`Before: ${this.test.parent.title}`);
            try {
                const loadDatasetPromises = [];
                for (const [id, path] of Object.entries(datasetsToLoad)) {
                    loadDatasetPromises.push(TestUtil_1.default.readFileAsync(path));
                }
                const loadedDatasets = (yield Promise.all(loadDatasetPromises)).map((buf, i) => {
                    return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
                });
                datasets = Object.assign({}, ...loadedDatasets);
                chai_1.expect(Object.keys(datasets)).to.have.length.greaterThan(0);
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
            }
            try {
                insightFacade = new InsightFacade_1.default();
            }
            catch (err) {
                Util_1.default.error(err);
            }
            finally {
                chai_1.expect(insightFacade).to.be.instanceOf(InsightFacade_1.default);
            }
        });
    });
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`BeforeTest: ${this.currentTest.title}`);
            const coursesId = "courses";
            const coursesExpectedCode = 204;
            let coursesResponse;
            try {
                coursesResponse =
                    yield insightFacade.addDataset(coursesId, datasets[coursesId], IInsightFacade_1.InsightDatasetKind.Courses);
            }
            catch (err) {
                coursesResponse = err;
            }
            finally {
                chai_1.expect(coursesResponse.code).to.equal(coursesExpectedCode);
            }
        });
    });
    after(function () {
        Util_1.default.test(`After: ${this.test.parent.title}`);
    });
    afterEach(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`AfterTest: ${this.currentTest.title}`);
        });
    });
});
describe("InsightFacade PerformQuery", () => {
    const datasetsToQuery = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
        emptydataset: "./test/data/emptydataset.zip",
        onedataset: "./test/data/onedataset.zip",
        twodataset: "./test/data/twodataset.zip",
        threedataset: "./test/data/threedataset.zip",
        querysuccesstest: "./test/data/querysuccesstest.zip",
    };
    let insightFacade;
    let testQueries = [];
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`Before: ${this.test.parent.title}`);
            try {
                testQueries = yield TestUtil_1.default.readTestQueries();
                chai_1.expect(testQueries).to.have.length.greaterThan(0);
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
            }
            try {
                insightFacade = new InsightFacade_1.default();
            }
            catch (err) {
                Util_1.default.error(err);
            }
            finally {
                chai_1.expect(insightFacade).to.be.instanceOf(InsightFacade_1.default);
            }
            try {
                const loadDatasetPromises = [];
                for (const [id, path] of Object.entries(datasetsToQuery)) {
                    loadDatasetPromises.push(TestUtil_1.default.readFileAsync(path));
                }
                const loadedDatasets = (yield Promise.all(loadDatasetPromises)).map((buf, i) => {
                    return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
                });
                chai_1.expect(loadedDatasets).to.have.length.greaterThan(0);
                const responsePromises = [];
                const datasets = Object.assign({}, ...loadedDatasets);
                for (const [id, content] of Object.entries(datasets)) {
                    responsePromises.push(insightFacade.addDataset(id, content, IInsightFacade_1.InsightDatasetKind.Courses));
                }
                try {
                    const responses = yield Promise.all(responsePromises);
                    responses.forEach((response) => chai_1.expect(response.code).to.equal(204));
                }
                catch (err) {
                    Util_1.default.warn(`Ignoring addDataset errors. For D1, you should allow errors to fail the Before All hook.`);
                }
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
            }
        });
    });
    beforeEach(function () {
        Util_1.default.test(`BeforeTest: ${this.currentTest.title}`);
    });
    after(function () {
        Util_1.default.test(`After: ${this.test.parent.title}`);
    });
    afterEach(function () {
        Util_1.default.test(`AfterTest: ${this.currentTest.title}`);
    });
    it("Should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, () => __awaiter(void 0, void 0, void 0, function* () {
                    let response;
                    try {
                        response = yield insightFacade.performQuery(test.query);
                    }
                    catch (err) {
                        response = err;
                    }
                    finally {
                        chai_1.expect(response.code).to.equal(test.response.code);
                        if (test.response.code >= 400) {
                            chai_1.expect(response.body).to.have.property("error");
                        }
                        else {
                            chai_1.expect(response.body).to.have.property("result");
                            const expectedResult = test.response.body.result;
                            const actualResult = response.body.result;
                            chai_1.expect(actualResult).to.deep.equal(expectedResult);
                        }
                    }
                }));
            }
        });
    });
});
describe("InsightFacade List Datasets", function () {
    const datasetsToLoad = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
        emptydataset: "./test/data/emptydataset.zip",
        onedataset: "./test/data/onedataset.zip",
        twodataset: "./test/data/twodataset.zip",
        threedataset: "./test/data/threedataset.zip",
    };
    let insightFacade;
    let datasets;
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            Util_1.default.test(`Before: ${this.test.parent.title}`);
            try {
                const loadDatasetPromises = [];
                for (const [id, path] of Object.entries(datasetsToLoad)) {
                    loadDatasetPromises.push(TestUtil_1.default.readFileAsync(path));
                }
                const loadedDatasets = (yield Promise.all(loadDatasetPromises)).map((buf, i) => {
                    return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
                });
                datasets = Object.assign({}, ...loadedDatasets);
                chai_1.expect(Object.keys(datasets)).to.have.length.greaterThan(0);
            }
            catch (err) {
                chai_1.expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
            }
            try {
                insightFacade = new InsightFacade_1.default();
            }
            catch (err) {
                Util_1.default.error(err);
            }
            finally {
                chai_1.expect(insightFacade).to.be.instanceOf(InsightFacade_1.default);
            }
        });
    });
    beforeEach(function () {
        Util_1.default.test(`BeforeTest: ${this.currentTest.title}`);
    });
    after(function () {
        Util_1.default.test(`After: ${this.test.parent.title}`);
    });
    afterEach(function () {
        Util_1.default.test(`AfterTest: ${this.currentTest.title}`);
    });
    it("should list an empty array when no datasets have been added", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        const expectedCode = 200;
        const expectedBody = [];
        try {
            response = yield insightFacade.listDatasets();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
            chai_1.expect(response.body).to.equal(expectedBody);
        }
    }));
    it("should list an empty dataset with 0 rows", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        const dataset = {
            id: "emptydataset",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 0,
        };
        const expectedCode = 200;
        const expectedBody = [dataset];
        yield insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);
        try {
            response = yield insightFacade.listDatasets();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
            chai_1.expect(response.body).to.equal(expectedBody);
        }
    }));
    it("should list a data set with a single row", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        const dataset = {
            id: "onedataset",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 1,
        };
        const expectedCode = 200;
        const expectedBody = [dataset];
        yield insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);
        try {
            response = yield insightFacade.listDatasets();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
            chai_1.expect(response.body).to.equal(expectedBody);
        }
    }));
    it("should list a dataset with 2 rows", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        const dataset = {
            id: "twodataset",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 2,
        };
        const expectedCode = 200;
        const expectedBody = [dataset];
        yield insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);
        try {
            response = yield insightFacade.listDatasets();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
            chai_1.expect(response.body).to.equal(expectedBody);
        }
    }));
    it("should list a single dataset with three rows", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        const dataset = {
            id: "threedataset",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 3,
        };
        const expectedCode = 200;
        const expectedBody = [dataset];
        yield insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);
        try {
            response = yield insightFacade.listDatasets();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
            chai_1.expect(response.body).to.equal(expectedBody);
        }
    }));
    it("should list two datasets - a 1-row and a 3-row dataset", () => __awaiter(this, void 0, void 0, function* () {
        let response;
        const dataset1 = {
            id: "onedataset",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 1,
        };
        const dataset2 = {
            id: "threedataset",
            kind: IInsightFacade_1.InsightDatasetKind.Courses,
            numRows: 3,
        };
        const expectedCode = 200;
        const expectedBody = [dataset1, dataset2];
        yield insightFacade.addDataset(dataset1.id, datasets[dataset1.id], dataset1.kind);
        yield insightFacade.addDataset(dataset2.id, datasets[dataset2.id], dataset2.kind);
        try {
            response = yield insightFacade.listDatasets();
        }
        catch (err) {
            response = err;
        }
        finally {
            chai_1.expect(response.code).to.equal(expectedCode);
            chai_1.expect(response.body).to.equal(expectedBody);
        }
    }));
});
//# sourceMappingURL=InsightFacade.spec.js.map