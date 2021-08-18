export class Key {

    // defining restricted words:
    protected KEYWORD: string[] = [
        "In", "dataset", "find", "all", "show", "and", "or", "sort", "by", "entries", "is", "the", "of", "whose"];

    protected M_OP: string[] = [
        "is", "not", "greater", "less", "than", "equal",
        "to"];

    protected S_OP: string[] = [
            "is", "not", "includes", "does", "include",
            "begins", "does", "begin", "ends", "does", "end", "with"];

    protected words: string[];

    protected highestIndex: number;
    protected currentIndex: number;

    protected previousWord: string;
    protected currentWord: string;

    constructor (key: string[]) {
        this.words = key;

        this.currentIndex = 0;
        this.highestIndex = (this.words.length - 1);
    }

    public getWords() {
        return this.words;
    }

    public IsSkey = function (str: string): boolean {
        const S_KEY: string[] = ["Department", "ID", "Instructor", "Title", "UUID"];
        let bool: boolean = false;

        S_KEY.forEach(function (skey) {
            if (str === skey) {
                bool = true;
                return;
            }
        });

        return bool;
    };

    public IsMkey = function (str: string): boolean {
        const M_KEY: string[] = ["Average", "Pass", "Fail", "Audit"];
        let bool: boolean = false;

        M_KEY.forEach(function (mkey) {
            if (str === mkey) {
                bool = true;
                return;
            }
        });

        return bool;
    };

    // sets the current word to be the next word in the array.
    // sets the previous word.
    protected NextWord = function () {
        if (this.currentWordIndex < this.highestIndex) {
            this.previousWord = this.currentWord;
            this.currentWord = null;
        } else {
            this.previousWord = this.currentWord;
            this.currentWordIndex++;
            this.currentWord = this.words[this.currentIndex];
        }
    };
}
