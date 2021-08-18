import { expect } from "chai";

import { InsightResponse, InsightResponseSuccessBody, InsightDatasetKind } from "../src/controller/IInsightFacade";
import { InsightDataset } from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import * as fs from "fs";

// npm test -- --grep "seeing how loading datasets works:"
describe("seeing how loading datasets works:" , function () {
    // courses: "./test/data/courses.zip",
    const datasetsToQuery: { [id: string]: string } = {
        twodataset: "./test/data/twodataset.zip",
        threedataset: "./test/data/threedataset.zip",
    };

    let insightFacade: InsightFacade;
    let datasets: { [id: string]: string };
    let loadPromises: Array<Promise<Buffer>>;

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);
        // let datasets: { [id: string]: string };

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.

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
            // turning the data into an array of <Promise<Buffer>>
            const loadDatasetPromises: Array<Promise<Buffer>> = [];

            for (const [id, path] of Object.entries(datasetsToQuery)) {
                loadDatasetPromises.push(TestUtil.readFileAsync(path));
            }

            // keeping the id of the data, but turning the buffered file into a base64 format.
            const loadedDatasets = (await Promise.all(loadDatasetPromises)).map((buf, i) => {
                Log.test("buf.toString(base64) creates this :" +  buf.toString("base64"));
                return { [Object.keys(datasetsToQuery)[i]]: buf.toString("base64") };
            });
            expect(loadedDatasets).to.have.length.greaterThan(0);

            // declaring an empty array of insight response promises.
            const responsePromises: Array<Promise<InsightResponse>> = [];

            // copying loaded datasets into the datasets variable.
            datasets = Object.assign({}, ...loadedDatasets);
            loadPromises = Object.assign({}, ...loadDatasetPromises);

            Log.test("Went through the entire Try Loop!");

        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        } finally {
            Log.test("Values stored in datasets array:" + datasets);
        }
    });

    it ("checking values stored in loadDatasetPromises", function () {
        const data = loadPromises;
        expect(data).to.equal("load promises");
    });

    it ("checking values stored in dataset", function () {
        const data = datasets;
        expect(data).to.equal("dataset");
    });

    it ("checking values stored in dataset[twodataset]", function () {
        // THIS IS HOW I WOULD ACCESS THE BASE64 VERSION OF DATA!!!
        const data = datasets["twodataset"];
        expect(data).to.equal("dataset");
    });

    it ("Trying to decode dataset[twodataset]", function () {
        // THIS IS HOW I WOULD ACCESS THE BASE64 VERSION OF DATA!!!
        const encoded = datasets["twodataset"];

        const buff = new Buffer(encoded, "base64");
        const text = buff.toJSON().data;

        const text2 = fs.readFileSync(encoded, {encoding: "base64"});

        expect(text2).to.equal("decoded");
    });
});
