const fs = require('fs');
const {
    getFileNames,
    getText,
    textToStpArray,
    stpToStemmer,
    countWords,
    writeToFile,
} = require("./utils");


const {
    SAMPLE_TEXT_FOLDER_NAME,
    TEXT_FILE_EXTENTION,
    STP_FOLDER_NAME,
    STP_FILE_EXTENTION,
    SFX_FOLDER_NAME,
    SFX_FILE_EXTENTION,
    JSON_FOLDER_NAME,
    JSON_FOLDER_EXTENTION
} = require('./constants');



function main() {
    const fileNames = getFileNames(SFX_FOLDER_NAME, SFX_FILE_EXTENTION);

    fileNames.forEach((fileName) => console.log(fileName));

    let allWordCounts = {};
    for (let fileName of fileNames) {
        const stemmedText = getText(SFX_FOLDER_NAME, fileName, SFX_FILE_EXTENTION);
        const stemmedArray = stemmedText.split('\n');
        stemmedArray.forEach(word =>
            allWordCounts[word] ?
                (allWordCounts[word] += 1) :
                allWordCounts[word] = 1
        )
    }
    console.log(allWordCounts)
}

main();