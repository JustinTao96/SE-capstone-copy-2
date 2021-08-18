"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Key_1 = require("./Key");
class DisplayKey extends Key_1.Key {
    constructor(key) {
        let lastWord = key[key.length - 1];
        const lastLetter = lastWord.charAt(lastWord.length - 1);
        if (lastLetter === ".") {
            lastWord = lastWord.slice(0, -1);
            key.pop();
            key.push(lastWord);
        }
        super(key);
        this.keysToShow = [];
        if (key.length < 2) {
            throw new Error("Invalid DISPLAY Key: must be at least two words long");
        }
        if (key[0] !== "show") {
            throw new Error("Invalid DISPLAY Key: unable to find 'show' at the beginning of the key");
        }
        let i = 1;
        while (i < key.length) {
            const word = key[i];
            if (this.EndsWithComma(word) === true) {
                const newWord = word.substring(0, word.length - 1);
                if (this.IsMkey(newWord) || this.IsSkey(newWord)) {
                    this.keysToShow.push(newWord);
                }
                else {
                    throw new Error("Invalid DISPLAY Key: invalid MKEY or SKEY");
                }
                i = i + 1;
            }
            else {
                if (this.IsMkey(word) === true || this.IsSkey(word) === true) {
                    this.keysToShow.push(word);
                }
                else {
                    throw new Error("Invalid DISPLAY Key: second last key does not end with comma but is invalid");
                }
                if (i + 2 === key.length - 1) {
                    const secondWord = key[i + 1];
                    const thirdWord = key[i + 2];
                    if (secondWord !== "and") {
                        throw new Error("Invalid DISPLAY Key: expected 'and'");
                    }
                    if (this.IsMkey(thirdWord) || this.IsSkey(thirdWord)) {
                        this.keysToShow.push(thirdWord);
                    }
                    else {
                        throw new Error("Invalid DISPLAY Key: invalid MKEY or SKEY");
                    }
                }
                else if (i !== key.length - 1) {
                    throw new Error("Invalid DISPLAY Key: final sequence is not KEY + 'and' + KEY");
                }
                i = key.length;
                break;
            }
        }
    }
    GetKeysToShow() {
        return this.keysToShow;
    }
    EndsWithComma(str) {
        const lastLetter = str.charAt(str.length - 1);
        if (lastLetter === ",") {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.DisplayKey = DisplayKey;
//# sourceMappingURL=DisplayKey.js.map