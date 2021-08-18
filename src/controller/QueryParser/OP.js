"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OP {
    constructor(key, op, comparison, length, nextOP) {
        this.isSOP = false;
        this.GetKey = function () {
            return this.key;
        };
        this.GetOp = function () {
            return this.op;
        };
        this.GetComparison = function () {
            if (this.isSOP === true) {
                const comp = this.comparison;
                return comp;
            }
            else {
                const comp = this.comparison;
                return comp;
            }
        };
        this.GetLength = function () {
            return this.length;
        };
        this.GetNextOP = function () {
            return this.nextOP;
        };
        this.key = key;
        this.op = op;
        this.comparison = comparison;
        this.length = length;
        this.nextOP = nextOP;
        if (typeof comparison === "string" || comparison instanceof String) {
            this.isSOP = true;
        }
        else {
            this.isSOP = false;
        }
    }
}
exports.OP = OP;
//# sourceMappingURL=OP.js.map