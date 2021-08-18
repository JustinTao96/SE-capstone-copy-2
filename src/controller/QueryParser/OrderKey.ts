import { Key } from "./Key";

export class OrderKey extends Key {
    // const expectedOrderKey: string[] = ["sort", "in", "ascending", "order", "by", "Average"];

    protected sortKey: string;
    protected operator: string;

    constructor(key: string[])  {
        super(key);

        // ensure that the input string is 6 words long
        if (key.length !== 6) {
            throw new Error("Invalid ORDER Key: order keys must be 6 words long");
        }

        // ensure that the first and second words are 'sort in'
        if (key[0] !== "sort" || key[1] !== "in") {
            throw new Error("Invalid ORDER Key: order keys must begin with 'sort in'");
        }

        // ensure that the third word is a valid operator and assign it to operator
        if (key[2] !== "ascending") {
            throw new Error("Invalid ORDER Key: order keys must have a valid operator after 'sort in'");
        } else {
            this.operator = key[2];
        }

        // ensure that the fourth and fifth words are "order" "in"
        if (key[3] !== "order" || key[4] !== "by") {
            throw new Error("Invalid ORDER Key: order keys must include 'order in' after the operator");
        }

        // ensure that the sixth word is a valid KEY
        if (this.IsSkey(key[5]) || this.IsMkey(key[5])) {
            this.sortKey = key[5];

        } else {
            throw new Error("Invalid ORDER Key: last word is not a valid S_KEY or M_KEY");
        }
    }

    public getSortKey = function () {
        return this.sortKey;
    };

    public getOperator = function () {
        return this.operator;
    };
}
