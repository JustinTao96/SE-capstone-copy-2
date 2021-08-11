import { expect } from "chai";

import { InsightResponse, InsightResponseSuccessBody, InsightDatasetKind } from "../src/controller/IInsightFacade";
import { InsightDataset } from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";

// Command to transcript to javascript before testing: tsc test/InsightFacade.spec.ts

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any;  // make any to allow testing structurally invalid queries
    response: InsightResponse;
    filename: string;  // This is injected when reading the file
}

describe("InsightFacade Add/Remove Dataset", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
        courses2: "./test/data/courses.zip",
        emptydataset: "./test/data/emptydataset.zip",
        onevalidcsv: "./test/data/onevalidcsv.zip",
        oneinvalidcsv: "./test/data/oneinvalidcsv.zip",
        oneinvalidname: "./test/data/oneinvalidname.zip",
    };

    let insightFacade: InsightFacade;
    // datasets is a dictionary with a key (id) of type String and value (path) of type String.
    let datasets: { [id: string]: string };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Attempting to open datasets
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
            });
            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // ADD DATASETS
    ///////////////////////////////////////////////////////////////////////////////////

    // TESTING TO SEE IF VALID DATASET IS ADDED
    it("Should add a valid dataset", async () => {
        const id: string = "courses";
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should add a valid dataset with only 1 csv file with 1 valid course with 0 rows.
    it("Should add a valid dataset with 1 csv file with a course but 0 rows", async () => {
        const id: string = "onevalidcsv";
        const expectedCode: number = 204;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // should reject an id that was previously added
    it("Should reject an id that was previously added", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        // adding first dataset into the collection.
        await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);

        // adding second dataset into the collection
        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a dataset when the id parameter has a space
    it("Should reject a dataset when the id parameter has a space", async () => {
        const id: string = "cour ses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a dataset when the id parameter has an underscore
    it("Should reject a dataset when the id parameter has an underscore", async () => {
        const id: string = "cour_ses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a dataset if it does not have at least one valid csv file in it.
    it("Should reject a dataset if it does not have at least one valid csv file in it", async () => {
        const id: string = "emptydataset";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a dataset if it does not have a valid course name
    it("Should reject a dataset if it does not have a valid course name", async () => {
        const id: string = "oneinvalidname";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a dataset if the csv files do not have at least one valid course in it.
    it("Should reject a dataset if it only contains a blank csv", async () => {
        const id: string = "oneinvalidcsv";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // TESTING TO SEE IF NULL ID IS REJECTED
    it("Should reject a null ID", async () => {
        const id: string = null;
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // TESTING TO SEE IF UNDEFINED ID IS REJECTED
    it("Should reject an undefined ID", async () => {
        const id: string = undefined;
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a content string that does not link to a valid zip file
    it("Should reject a non-existent content", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        const badPath: string = "good53675678845morning2457457sir";

        try {
            response = await insightFacade.addDataset(id, badPath, InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should allow two courses to have the same content path
    it("Should allow two courses to have the same content path", async () => {
        const id: string = "courses";
        const id2: string = "courses2";
        const expectedCode: number = 204;
        let response: InsightResponse;

        await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);

        try {
            response = await insightFacade.addDataset(id2, datasets[id2], InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a null content value
    it("Should reject a null content value", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        const badPath: string = null;

        try {
            response = await insightFacade.addDataset(id, badPath, InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // TESTING TO SEE IF UNDEFINED CONTENT IS REJECTED
    it("Should reject an undefined content value", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;
        const badPath: string = undefined;

        try {
            response = await insightFacade.addDataset(id, badPath, InsightDatasetKind.Courses);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject the rooms InsightDataSetKind
    it("Should reject the rooms InsightDataSetKind", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject a null InsightDataSetKind
    it("Should reject a null InsightDataSetKind", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], null);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should reject an undefined InsightDataSetKind
    it("Should reject an undefined InsightDataSetKind", async () => {
        const id: string = "courses";
        const expectedCode: number = 400;
        let response: InsightResponse;

        try {
            response = await insightFacade.addDataset(id, datasets[id], undefined);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // REMOVE DATASETS
    ///////////////////////////////////////////////////////////////////////////////////

    // Should remove a dataset with an id that is already persisted to memory
    it("Should remove the courses dataset", async () => {
        const id: string = "courses";
        const expectedCode: number = 204;
        let response: InsightResponse;

        await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Testing to see if removing the same dataset twice will succeed on the first try, and fail on second.
    it("Should fail to remove courses dataset after it is already removed", async () => {
        const id: string = "courses";
        const expectedCode: number = 404;
        let response: InsightResponse;

        await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
        await insightFacade.removeDataset(id);

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should fail to remove a dataset that has not been added.
    it("Should fail to remove dataset with an id that has a space", async () => {
        const id: string = "courses";
        const expectedCode: number = 404;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should fail to remove a dataset with an id that has a space in it.
    it("Should fail to remove dataset with an id that has a space", async () => {
        const id: string = "cour ses";
        const expectedCode: number = 404;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should fail to remove a dataset with an id that has an underscore.
    it("Should fail to remove dataset with an id that has an underscore", async () => {
        const id: string = "cour_ses";
        const expectedCode: number = 404;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should fail to remove courses dataset with a null id
    it("Should fail to remove courses dataset with a null id", async () => {
        const id: string = null;
        const expectedCode: number = 404;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });

    // Should fail to remove courses dataset with a undefined id
    it("Should fail to remove courses dataset with an undefined id", async () => {
        const id: string = undefined;
        const expectedCode: number = 404;
        let response: InsightResponse;

        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
        }
    });
});

// should add a dataset at the start so that we can try to add/remove it (currently unused)
describe("InsightFacade pre-adding a dataset to test Add/Remove Dataset", function () {

    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
    };

    let insightFacade: InsightFacade;
    // datasets is a dictionary with a key (id) of type String and value (path) of type String.
    let datasets: { [id: string]: string };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Attempting to open datasets
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];

            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }

            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
            });

            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);

        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }
    });

    // adds courses to the database before each test is run
    beforeEach(async function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
        const coursesId: string = "courses";
        const coursesExpectedCode: number = 204;
        let coursesResponse: InsightResponse;

        try {
            coursesResponse =
            await insightFacade.addDataset(coursesId, datasets[coursesId], InsightDatasetKind.Courses);
         } catch (err) {
                coursesResponse = err;
         } finally {
                expect(coursesResponse.code).to.equal(coursesExpectedCode);
        }
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(async function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });
});

// This test suite dynamically generates tests from the JSON files in test/queries.
// You should not need to modify it; instead, add additional files to the queries directory.
describe("InsightFacade PerformQuery", () => {
    const datasetsToQuery: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
        emptydataset: "./test/data/emptydataset.zip",
        onedataset: "./test/data/onedataset.zip",
        twodataset: "./test/data/twodataset.zip",
        threedataset: "./test/data/threedataset.zip",
        querysuccesstest: "./test/data/querysuccesstest.zip",
    };
    let insightFacade: InsightFacade;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries();
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }

        // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
            });
            expect(loadedDatasets).to.have.length.greaterThan(0);

            const responsePromises: Array<Promise<InsightResponse>> = [];
            const datasets: { [id: string]: string } = Object.assign({}, ...loadedDatasets);
            for (const [id, content] of Object.entries(datasets)) {
                responsePromises.push(insightFacade.addDataset(id, content, InsightDatasetKind.Courses));
            }

            // This try/catch is a hack to let your dynamic tests execute enough the addDataset method fails.
            // In D1, you should remove this try/catch to ensure your datasets load successfully before trying
            // to run you queries.
            try {
                const responses: InsightResponse[] = await Promise.all(responsePromises);
                responses.forEach((response) => expect(response.code).to.equal(204));
            } catch (err) {
                Log.warn(`Ignoring addDataset errors. For D1, you should allow errors to fail the Before All hook.`);
            }
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // TEST QUERIES
    ///////////////////////////////////////////////////////////////////////////////////
    // Dynamically create and run a test for each query in testQueries
    it("Should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, async () => {
                    let response: InsightResponse;

                    try {
                        response = await insightFacade.performQuery(test.query);
                    } catch (err) {
                        response = err;
                    } finally {
                        expect(response.code).to.equal(test.response.code);

                        if (test.response.code >= 400) {
                            expect(response.body).to.have.property("error");
                        } else {
                            expect(response.body).to.have.property("result");
                            const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                            const actualResult = (response.body as InsightResponseSuccessBody).result;
                            expect(actualResult).to.deep.equal(expectedResult);
                        }
                    }
                });
            }
        });
    });
});

// TESTING LIST DATASET
describe("InsightFacade List Datasets", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        new: "./test/data/newdataset.zip",
        emptydataset: "./test/data/emptydataset.zip",
        onedataset: "./test/data/onedataset.zip",
        twodataset: "./test/data/twodataset.zip",
        threedataset: "./test/data/threedataset.zip",
    };

    let insightFacade: InsightFacade;
    // datasets is a dictionary with a key (id) of type String and value (path) of type String.
    let datasets: { [id: string]: string };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Attempting to open datasets
        try {
            const loadDatasetPromises: Array<Promise<Buffer>> = [];
            for (const [id, path] of Object.entries(datasetsToLoad)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                return { [Object.keys(datasetsToLoad)[i]]: buf.toString("base64") };
            });
            datasets = Object.assign({}, ...loadedDatasets);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }

        try {
            insightFacade = new InsightFacade();
        } catch (err) {
            Log.error(err);
        } finally {
            expect(insightFacade).to.be.instanceOf(InsightFacade);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // LIST DATASETS
    ///////////////////////////////////////////////////////////////////////////////////
    // rows is equal to how many rows exist in all csv files excluding the title of a single InsightDataset.

    // should list an empty array when no datasets have been added.
    it("should list an empty array when no datasets have been added", async () => {
        let response: InsightResponse;
        const expectedCode: number = 200;
        const expectedBody: InsightDataset[] = [];

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.equal(expectedBody);
        }
    });

    // testing an empty dataset with no rows
    it("should list an empty dataset with 0 rows", async () => {
        let response: InsightResponse;

        const dataset: InsightDataset = {
            id: "emptydataset",
            kind: InsightDatasetKind.Courses,
            numRows: 0,
        };

        const expectedCode: number = 200;
        const expectedBody: InsightDataset[] = [dataset];

        await insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.equal(expectedBody);
        }
    });

    // testing a dataset with 1 csv file and 1 total rows
    // rows is equal to 1 because there is only one row in its one csv file.
    it("should list a data set with a single row", async () => {
        let response: InsightResponse;

        const dataset: InsightDataset = {
            id: "onedataset",
            kind: InsightDatasetKind.Courses,
            numRows: 1,
        };

        const expectedCode: number = 200;
        const expectedBody: InsightDataset[] = [dataset];

        // this could cause an error because it is not nested try/catch.
        await insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.equal(expectedBody);
        }
    });

    // testing a dataset with 2 csv files and 2 total rows
    it("should list a dataset with 2 rows", async () => {
        let response: InsightResponse;

        const dataset: InsightDataset = {
            id: "twodataset",
            kind: InsightDatasetKind.Courses,
            numRows: 2,
        };

        const expectedCode: number = 200;
        const expectedBody: InsightDataset[] = [dataset];

        // this could cause an error because it is not nested try/catch.
        await insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.equal(expectedBody);
        }
    });

    // testing a dataset with 2 csv files, and three total rows
    it("should list a single dataset with three rows", async () => {
        let response: InsightResponse;

        const dataset: InsightDataset = {
            id: "threedataset",
            kind: InsightDatasetKind.Courses,
            numRows: 3,
        };
        const expectedCode: number = 200;
        const expectedBody: InsightDataset[] = [dataset];

        // this could cause an error because it is not nested try/catch.
        await insightFacade.addDataset(dataset.id, datasets[dataset.id], dataset.kind);

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.equal(expectedBody);
        }
    });

    // testing two datasets - one with 1 row and another with 3 rows.
    it("should list two datasets - a 1-row and a 3-row dataset", async () => {
        let response: InsightResponse;

        const dataset1: InsightDataset = {
            id: "onedataset",
            kind: InsightDatasetKind.Courses,
            numRows: 1,
        };

        const dataset2: InsightDataset = {
            id: "threedataset",
            kind: InsightDatasetKind.Courses,
            numRows: 3,
        };

        const expectedCode: number = 200;
        const expectedBody: InsightDataset[] = [dataset1, dataset2];

        // this could cause an error because it is not nested try/catch.
        await insightFacade.addDataset(dataset1.id, datasets[dataset1.id], dataset1.kind);
        await insightFacade.addDataset(dataset2.id, datasets[dataset2.id], dataset2.kind);

        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        } finally {
            expect(response.code).to.equal(expectedCode);
            expect(response.body).to.equal(expectedBody);
        }
    });

});
