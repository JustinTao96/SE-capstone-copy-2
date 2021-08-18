"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Key {
    constructor(key) {
        this.KEYWORD = [
            "In", "dataset", "find", "all", "show", "and", "or", "sort", "by", "entries", "is", "the", "of", "whose"
        ];
        this.M_OP = [
            "is", "not", "greater", "less", "than", "equal",
            "to"
        ];
        this.S_OP = [
            "is", "not", "includes", "does", "include",
            "begins", "does", "begin", "ends", "does", "end", "with"
        ];
        this.IsSkey = function (str) {
            const S_KEY = ["Department", "ID", "Instructor", "Title", "UUID"];
            let bool = false;
            S_KEY.forEach(function (skey) {
                if (str === skey) {
                    bool = true;
                    return;
                }
            });
            return bool;
        };
        this.IsMkey = function (str) {
            const M_KEY = ["Average", "Pass", "Fail", "Audit"];
            let bool = false;
            M_KEY.forEach(function (mkey) {
                if (str === mkey) {
                    bool = true;
                    return;
                }
            });
            return bool;
        };
        this.NextWord = function () {
            if (this.currentWordIndex < this.highestIndex) {
                this.previousWord = this.currentWord;
                this.currentWord = null;
            }
            else {
                this.previousWord = this.currentWord;
                this.currentWordIndex++;
                this.currentWord = this.words[this.currentIndex];
            }
        };
        this.words = key;
        this.currentIndex = 0;
        this.highestIndex = (this.words.length - 1);
    }
    getWords() {
        return this.words;
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map