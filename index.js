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
    JSON_FOLDER_EXTENTION,
} = require("./constants");

function main() {
    let fileNames = getFileNames(SAMPLE_TEXT_FOLDER_NAME, TEXT_FILE_EXTENTION);

    fileNames.forEach((fileName) => console.log(fileName));

    for (let fileName of fileNames) {
        const text = getText(
            SAMPLE_TEXT_FOLDER_NAME,
            fileName,
            TEXT_FILE_EXTENTION
        );

        const stpArray = textToStpArray(text);
        const stemmedArray = stpToStemmer(stpArray);

        const stpText = stpArray.join("\n");
        const stemmedText = stemmedArray.join("\n");

        const wordCountsObj = countWords(stemmedArray);

        const wordCountsStr = JSON.stringify(wordCountsObj, null, 2);

        writeToFile(STP_FOLDER_NAME, fileName, stpText, STP_FILE_EXTENTION);
        writeToFile(SFX_FOLDER_NAME, fileName, stemmedText, SFX_FILE_EXTENTION);
        writeToFile(
            JSON_FOLDER_NAME,
            fileName,
            wordCountsStr,
            JSON_FOLDER_EXTENTION
        );
    }
}

main();
