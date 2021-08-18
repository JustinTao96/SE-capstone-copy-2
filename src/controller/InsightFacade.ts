import Log from "../Util";
import {IInsightFacade, InsightResponse, InsightDatasetKind} from "./IInsightFacade";
import {Datasets} from "./Datasets";

/**
 * This is the main programmatic entry point for the project.
 */
export default class InsightFacade implements IInsightFacade {

    private datasets: Datasets;

    constructor() {
        Log.trace("InsightFacadeImpl::init()");
        this.datasets = new Datasets();
    }

    public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<InsightResponse> {
        // return Promise.reject({code: -1, body: null});
        return this.datasets.addDataset(id, content, kind);
    }

    public removeDataset(id: string): Promise<InsightResponse> {
        // return Promise.reject({code: -1, body: null});
        return this.datasets.removeDataset(id);
    }

    public performQuery(query: string): Promise <InsightResponse> {
        // return Promise.reject({code: -1, body: null});

        // this might have to be turned into an async await try/catch block.
        return this.datasets.performQuery(query);
    }

    public listDatasets(): Promise<InsightResponse> {
        // return Promise.reject({code: -1, body: null});
        return this.datasets.listDatasets();
    }
}
