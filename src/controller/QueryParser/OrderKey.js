"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
class OrderKey extends Key_1.Key {
    constructor(key) {
        super(key);
        this.getSortKey = function () {
            return this.sortKey;
        };
        this.getOperator = function () {
            return this.operator;
        };
        if (key.length !== 6) {
            throw new Error("Invalid ORDER Key: order keys must be 6 words long");
        }
        if (key[0] !== "sort" || key[1] !== "in") {
            throw new Error("Invalid ORDER Key: order keys must begin with 'sort in'");
        }
        if (key[2] !== "ascending") {
            throw new Error("Invalid ORDER Key: order keys must have a valid operator after 'sort in'");
        }
        else {
            this.operator = key[2];
        }
        if (key[3] !== "order" || key[4] !== "by") {
            throw new Error("Invalid ORDER Key: order keys must include 'order in' after the operator");
        }
        if (this.IsSkey(key[5]) || this.IsMkey(key[5])) {
            this.sortKey = key[5];
        }
        else {
            throw new Error("Invalid ORDER Key: last word is not a valid S_KEY or M_KEY");
        }
    }
}
exports.OrderKey = OrderKey;
//# sourceMappingURL=OrderKey.js.map