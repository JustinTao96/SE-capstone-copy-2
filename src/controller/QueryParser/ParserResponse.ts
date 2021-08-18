import { InsightResponse } from "../IInsightFacade";
import { QueryParser } from "./QueryParser";

export class ParserResponse {
    protected response: Promise<InsightResponse>;
    protected openedJson: {};

    // i will be looking for a specific key's base64 string and decoding it back into json

    public GetResponse(parser: QueryParser, data: { [id: string]: string }): Promise<InsightResponse> {
        // Figure out which key (id) to open
        const idToOpen: string = parser.getDatasetKey().getID();

        // Get the base64 string of the key to open
        let base64Contents: string;
        try {
            base64Contents = this.GetBase64Data(idToOpen, data);
        } catch (err) {
            throw err;
        }

        // convert the base64 string into a json object
        this.openedJson = this.DecodeContent(base64Contents);

        // get an array of csv files from the json object
        // const csvArray = this.GetCSVFilesFromJson(this.openedJson);

        // for each value in the csv array, obtain the lines that match our filters: filteredArr[]
        // const FilteredArr = this.FilterCSVFiles(csvArray);

        // for each value in the filteredArr[], obtain the lines that match our Show: showedArr[]
        // const ShowedArr = this.GetLinesToShow(FilteredArr);

        // for each value in showedArr[], obtain a sorted version of the lines: sortedArr[]
        // const sortedArr: [] = this.SortShowedArr(ShowedArr);

        // if all these steps are successful, set this.response.body to sortedArr[], and code to 204.
        // const responseCode: number = 204;
        // const responseBody = {result: sortedArr};

        // this.response = Promise.resolve({code: 200, body: responseBody});

        return this.response;
    }

    private GetBase64Data = function (key: string, data: { [id: string]: string }): string {
        // checks if the string key is a key within the data object.
        if (key in data) {
            // return the value associated with the key
            return data[key];
        } else {
            throw new Error("Error: the specified dataset cannot be found");
        }
    };

    private DecodeContent = function (base64Content: string): {} {
        const content = JSON.parse(atob(base64Content));
        return null;
    };

    private GetCSVFilesFromJson = function (openedJson: string): void {
        return null;
    };

    private FilterCSVFiles = function (csvArray: string): void {
        return null;
    };

    private GetLinesToShow = function (FilteredArr: string): void {
        return null;
    };

    private SortShowedArr = function (ShowedArr: string): [] {
        return [];
    };
}
