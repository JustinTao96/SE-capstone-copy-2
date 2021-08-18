import InsightFacade from "./InsightFacade";
import Log from "../Util";
import {IInsightFacade, InsightResponse, InsightDatasetKind, InsightResponseSuccessBody} from "./IInsightFacade";
import {InsightDataset} from "./IInsightFacade";
import { QueryParser } from "./QueryParser/QueryParser";
import { ParserResponse } from "./QueryParser/ParserResponse";

// there should only ever be one instance of the Datasets class
export class Datasets {

    // data is a dictionary with a key (id) of type String and value (content) of type String.
    private data: { [id: string]: string };

    // adds the dataset into both the data field in this class, and into the local machine's data folder.
    // will have to turn the input into a zip folder and return the correct InsightResponse.
    public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    // removes the dataset from both the data field in this class, and removes the zip file from
    // the local machine. returns an InsightResponse.
    public removeDataset(id: string): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    // Needs to be able to parse and read the query,
    // then open the appropriate dataset stored in data,
    // then operate on the content, and return the correct InsightResponse.
    public performQuery(query: string): Promise <InsightResponse> {
        let parser: QueryParser;

        // checks to see if the query string is valid.
        try {
            parser = new QueryParser(query);
        } catch (err) {
            const responseBody = {error: err};
            const responseCode = 400;
            return Promise.reject({code: responseCode, body: responseBody});
        }

        // at this point, parser should hold information about all the keys.
        // I will now create a new object called ParserResponse;
        // Parser response should read the parser values, and create an insight response.
        const parserResponse: ParserResponse = new ParserResponse();
        const response: Promise<InsightResponse> = parserResponse.GetResponse(parser, this.data);
        return Promise.resolve(response);

        // Placeholder Response below:
        // const successBody: InsightResponseSuccessBody = {result: "not yet implemented"};
        // return Promise.resolve({code: 200, body: successBody});
    }

    // Should read the data dictionary and use it to return an InsightResponse.
    public listDatasets(): Promise<InsightResponse> {
        return Promise.reject({code: -1, body: null});
    }

    // getter for our data dictionary.
    public getData() {
        return this.data;
    }
}
