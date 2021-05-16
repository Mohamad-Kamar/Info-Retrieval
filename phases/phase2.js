const fs = require("fs");
const {
    getBaseLog,
    getFileNames,
    getText,
    textToStpArray,
    stpToStemmer,
    countWords,
    writeToFile,
    getTermFreq,
    logAsTable,
    getFilledEmptyWords,
    tableFromCounter
} = require("./utils");

const {
    TEXT_FOLDER_NAME,
    TEXT_FILE_EXTENTION,
    STP_FOLDER_NAME,
    STP_FILE_EXTENTION,
    SFX_FOLDER_NAME,
    SFX_FILE_EXTENTION,
    JSON_COUNTER_FOLDER_NAME,
    JSON_FILE_EXTENTION,
    FINAL_FILES_FOLDER
} = require("./constants");

function main() {
    const fileNames = getFileNames(SFX_FOLDER_NAME, SFX_FILE_EXTENTION);

    let docCountArray = [];
    let allWordCounts = {};

    for (let fileName of fileNames) {
        //read sfx files
        const stemmedText = getText(
            SFX_FOLDER_NAME,
            fileName,
            SFX_FILE_EXTENTION
        );
        const stemmedArray = stemmedText.split(/\W+/g);
        // console.log(stemmedArray);
        if (stemmedArray.length == 0) {
            continue;
        }
        const wordCountsObj = countWords(stemmedArray);

        //count words
        stemmedArray.forEach((word) =>
            allWordCounts[word]
                ? (allWordCounts[word] += 1)
                : (allWordCounts[word] = 1)
        );

        docCountArray.push({ name: fileName, wordObj: wordCountsObj });

        // const wordCountsStr = JSON.stringify(wordCountsObj, null, 2);
        // writeToFile(
        //     JSON_COUNTER_FOLDER_NAME,
        //     fileName,
        //     wordCountsStr,
        //     JSON_FILE_EXTENTION
        // );
    }
    // fillEmptyWords(docCountArray, allWordCounts);

    let occurances = getTermFreq(allWordCounts, docCountArray);

    let docBoolArray = tableFromCounter(docCountArray, "binary");

    let docTFIDFArray = tableFromCounter(
        docCountArray,
        "TFIDF",
        fileNames.length,
        occurances
    );
    // console.log(docCountArray)
    let words = Object.keys(allWordCounts);
    writeToFile(
        "./allWords",
        "allWords",
        JSON.stringify(allWordCounts, null, 2),
        "json"
    );
    words
        .sort((a, b) => allWordCounts[b] - allWordCounts[a])
        .forEach((word) => console.log(word + ": " + allWordCounts[word]));
    writeFinalFiles(docBoolArray, docCountArray, docTFIDFArray, words);
}

function writeFinalFiles(docBoolArray, docCountArray, docTFIDFArray, words) {
    // writeToFile('./Tables','Bool',logAsTable(docBoolArray, words),'txt')
    // console.log('====================================================')
    // writeToFile('./Tables','Count',logAsTable(docCountArray, words),'txt')
    // console.log('====================================================')
    // writeToFile('./Tables','TFIDF',logAsTable(docTFIDFArray, words),'txt')

    // to JOSN
    writeToFile(
        "./JSON",
        "Bool",
        JSON.stringify(docBoolArray, null, 2),
        "json"
    );
    console.log("====================================================");
    writeToFile(
        "./JSON",
        "Counts",
        JSON.stringify(docCountArray, null, 2),
        "json"
    );
    console.log("====================================================");
    writeToFile(
        "./JSON",
        "TFIDF",
        JSON.stringify(docTFIDFArray, null, 2),
        "json"
    );

    saveInv(docBoolArray, "InvBOOL");
    saveInv(docCountArray, "InvTFRQ");
    saveInv(docTFIDFArray, "InvertedTFIDF");
}
function saveInv(arr, fileName) {
    let str = "";
    let names = arr.map((elem) => elem.name);
    let elems = arr.map((elem) => elem.wordObj);
    console.log("++++++++==========");
    console.log(elems[0]);
    console.log("++++++++==========");
    for (let i = 0; i < names.length; i++) {
        str += "'" + names[i] + "'\n\n";
        str +=
            Object.keys(elems[i]).join("\n") +
            "\n\n=========================================\n\n";
    }
    writeToFile(FINAL_FILES_FOLDER, fileName, str, TEXT_FILE_EXTENTION);
}
main();
