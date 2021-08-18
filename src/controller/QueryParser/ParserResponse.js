"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParserResponse {
    constructor() {
        this.GetBase64Data = function (key, data) {
            if (key in data) {
                return data[key];
            }
            else {
                throw new Error("Error: the specified dataset cannot be found");
            }
        };
        this.DecodeContent = function (base64Content) {
            const content = JSON.parse(atob(base64Content));
            return null;
        };
        this.GetCSVFilesFromJson = function (openedJson) {
            return null;
        };
        this.FilterCSVFiles = function (csvArray) {
            return null;
        };
        this.GetLinesToShow = function (FilteredArr) {
            return null;
        };
        this.SortShowedArr = function (ShowedArr) {
            return [];
        };
    }
    GetResponse(parser, data) {
        const idToOpen = parser.getDatasetKey().getID();
        let base64Contents;
        try {
            base64Contents = this.GetBase64Data(idToOpen, data);
        }
        catch (err) {
            throw err;
        }
        this.openedJson = this.DecodeContent(base64Contents);
        return this.response;
    }
}
exports.ParserResponse = ParserResponse;
//# sourceMappingURL=ParserResponse.js.map