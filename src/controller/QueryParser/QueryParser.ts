import { DatasetKey } from "./DatasetKey";
import { DisplayKey } from "./DisplayKey";
import { FilterKey } from "./FilterKey";
import { OrderKey } from "./OrderKey";

export class QueryParser {
    // format of a query: DATASET + ', ' + FILTER + '; ' + DISPLAY(+ '; ' + ORDER)? + '.'
    // example of a query:
    // In courses dataset courses,
    // find entries whose Average is greater than 90 and Department is \"adhe\" or Average is equal to 95;
    // show Department, ID and Average.
    // sort in ascending order by Average

    protected query: string[];
    private datasetKey: DatasetKey;
    private filterKey: FilterKey;
    private displayKey: DisplayKey;
    private orderKey: OrderKey;

    // if the query can be split into four chunks, try to construct each key. throw errors to Datasets.ts.PerformQuery
    constructor(query: string) {
        this.query = query.split(" ");

        try {
            this.TestValidQuery(query);
        } catch (error) {
            throw error;
        }

        try {
            this.SplitQueryIntoKeys(query);
        } catch (error) {
            throw error;
        }
    }

    public getQuery = function () {
        return this.query;
    };

    public getDatasetKey = function () {
        return this.datasetKey;
    };

    public getFilterKey = function () {
        return this.filterKey;
    };

    public getDisplayKey = function () {
        return this.displayKey;
    };

    public getOrderKey = function () {
        if (this.orderKey !== null && this.orderKey !== undefined) {
            return this.orderKey;
        }
    };

    // checks if the query is valid and splittable into 4 keys;
    public TestValidQuery = function (query: string) {
        let firstChunk: string[];
        let secondChunk: string[];

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

        // if there are less than 4 words in the secondChunk, throw an error
        if (secondChunk.length < 4) {
            throw new Error("invalid QUERY: ensure that DATASET and FILTER keys are correctly formatted");
        }
    };

    // splits the queries into keys and tries to construct them.
    public SplitQueryIntoKeys = function (query: string) {

        // FIRST CHUNK:
        // 0 DATASET + FILTER
        // 1 DISPLAY
        // 2 ORDER

        // SECOND CHUNK:
        // 0 DATASET
        // 1 FILTER

        const firstChunk: string[] = query.split(";");

        // since the length of the dataset is always 4 words, split firstChunk0 by spaces;
        const secondChunk: string[] = firstChunk[0].split(" ");

        // if there are less than 4 words in the secondChunk, throw an error
        if (secondChunk.length < 4) {
            throw new Error("invalid QUERY: are you missing any keys?");
        }

        // if there are more than 4 words in the secondChunk, assign the first four words to datasetKey.
        const datasetKeyValues = secondChunk.slice(0 , 4);
        // assign everything after the first four words to filterkey.
        const filterKeyValues = secondChunk.slice(4, secondChunk.length);

        const finalKey: string = firstChunk[firstChunk.length - 1];
        const displayKeyValues = firstChunk[1].split(" ");

        displayKeyValues.shift();

        try {
            this.datasetKey = new DatasetKey(datasetKeyValues);
        } catch (error) {
            throw error;
        }

        try {
            this.filterKey = new FilterKey(filterKeyValues);
        } catch (error) {
            throw error;
        }

        try {
            this.displayKey = new DisplayKey(displayKeyValues);
        } catch (error) {
            throw error;
        }

        // If there is an order keyword, remove the space at the end and try to create the OrderKey.
        if (firstChunk.length === 3) {
            const removePeriodValues = finalKey.split(".");
            const orderKeyValues = removePeriodValues[0].split(" ");
            orderKeyValues.shift();

            try {
                this.orderKey = new OrderKey(orderKeyValues);
            } catch (error) {
                throw error;
            }
        }
    };
}
