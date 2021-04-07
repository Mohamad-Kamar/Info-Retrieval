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
    tableFromCounter,
} = require("./utils");

const {
    SAMPLE_TEXT_FOLDER_NAME,
    TEXT_FILE_EXTENTION,
    STP_FOLDER_NAME,
    STP_FILE_EXTENTION,
    SFX_FOLDER_NAME,
    SFX_FILE_EXTENTION,
    JSON_COUNTER_FOLDER_NAME,
    JSON_FOLDER_EXTENTION,
    FINAL_FILES_FOLDER,
} = require("./constants");

function main() {
    const fileNames = getFileNames(SFX_FOLDER_NAME, SFX_FILE_EXTENTION);

    let docCountArray = [];
    let allWordCounts = {};

    for (let fileName of fileNames) {
        //read sfx files
        const stemmedText = getText(SFX_FOLDER_NAME, fileName, SFX_FILE_EXTENTION);
        const stemmedArray = stemmedText.split("\n");
        const wordCountsObj = countWords(stemmedArray);

        //count words
        stemmedArray.forEach((word) =>
            allWordCounts[word]
                ? (allWordCounts[word] += 1)
                : (allWordCounts[word] = 1)
        );

        docCountArray.push({ name: fileName, wordCounts: wordCountsObj });

        // const wordCountsStr = JSON.stringify(wordCountsObj, null, 2);
        // writeToFile(
        //     JSON_COUNTER_FOLDER_NAME,
        //     fileName,
        //     wordCountsStr,
        //     JSON_FOLDER_EXTENTION
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

    console.log(docTFIDFArray);
}

function saveInvBOOL(fileNames, fileName) {
    let str = "";
    fileNames.forEach((name) => {
        str += '"' + name + '"' + "\n";
        let data = JSON.parse(
            getText(JSON_COUNTER_FOLDER_NAME, name, JSON_FOLDER_EXTENTION)
        );
        for (word in data) str += word + "\t" + data[word] + "\n";
        str += "\n\n";
    });
    writeToFile(FINAL_FILES_FOLDER, fileName, str, TEXT_FILE_EXTENTION);
}
main();
