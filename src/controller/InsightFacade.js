"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
const Datasets_1 = require("./Datasets");
class InsightFacade {
    constructor() {
        Util_1.default.trace("InsightFacadeImpl::init()");
        this.datasets = new Datasets_1.Datasets();
    }
    addDataset(id, content, kind) {
        return this.datasets.addDataset(id, content, kind);
    }
    removeDataset(id) {
        return this.datasets.removeDataset(id);
    }
    performQuery(query) {
        return this.datasets.performQuery(query);
    }
    listDatasets() {
        return this.datasets.listDatasets();
    }
}
exports.default = InsightFacade;
//# sourceMappingURL=InsightFacade.js.map