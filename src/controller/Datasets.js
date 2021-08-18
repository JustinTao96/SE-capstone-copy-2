"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueryParser_1 = require("./QueryParser/QueryParser");
const ParserResponse_1 = require("./QueryParser/ParserResponse");
class Datasets {
    addDataset(id, content, kind) {
        return Promise.reject({ code: -1, body: null });
    }
    removeDataset(id) {
        return Promise.reject({ code: -1, body: null });
    }
    performQuery(query) {
        let parser;
        try {
            parser = new QueryParser_1.QueryParser(query);
        }
        catch (err) {
            const responseBody = { error: err };
            const responseCode = 400;
            return Promise.reject({ code: responseCode, body: responseBody });
        }
        const parserResponse = new ParserResponse_1.ParserResponse();
        const response = parserResponse.GetResponse(parser, this.data);
        return Promise.resolve(response);
    }
    listDatasets() {
        return Promise.reject({ code: -1, body: null });
    }
    getData() {
        return this.data;
    }
}
exports.Datasets = Datasets;
//# sourceMappingURL=Datasets.js.map