"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
class InsightFacade {
    constructor() {
        Util_1.default.trace("InsightFacadeImpl::init()");
    }
    addDataset(id, content, kind) {
        return Promise.reject({ code: -1, body: null });
    }
    removeDataset(id) {
        return Promise.reject({ code: -1, body: null });
    }
    performQuery(query) {
        return Promise.reject({ code: -1, body: null });
    }
    listDatasets() {
        return Promise.reject({ code: -1, body: null });
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map