const {
    getFileNames,
    getText,
    textToStpArray,
    stpToStemmer,
    countWords,
    writeToFile
} = require("../utils");

const {
    TEXT_FOLDER_NAME,
    TEXT_FILE_EXTENTION,
    STP_FOLDER_NAME,
    STP_FILE_EXTENTION,
    SFX_FOLDER_NAME,
    SFX_FILE_EXTENTION,
    JSON_COUNTER_FOLDER_NAME,
    JSON_FILE_EXTENTION
} = require("../constants");

const path = require("path");

const phase1 = async (libName) => {
    const basePath = path.join(process.cwd(), "Libraries", libName);
    const TextPath = path.join(basePath, TEXT_FOLDER_NAME);
    let docNames = await getFileNames(TextPath, TEXT_FILE_EXTENTION);

    // docNames.forEach((docName) => console.log(docName));

    for (let docName of docNames) {
        const docPath = path.join(TextPath, docName);
        const text = await getText(docPath, TEXT_FILE_EXTENTION);
        const stpArray = textToStpArray(text);
        const stemmedArray = stpToStemmer(stpArray);

        const stpText = stpArray.join("\n");
        const stemmedText = stemmedArray.join("\n");

        const wordCountsObj = countWords(stemmedArray);

        const wordCountsStr = JSON.stringify(wordCountsObj, null, 2);
        const StpPath = path.join(basePath, STP_FOLDER_NAME, docName);
        const SfxPath = path.join(basePath, SFX_FOLDER_NAME, docName);
        const JsonPath = path.join(basePath, JSON_COUNTER_FOLDER_NAME, docName);

        writeToFile(StpPath, stpText, STP_FILE_EXTENTION);
        writeToFile(SfxPath, stemmedText, SFX_FILE_EXTENTION);
        writeToFile(JsonPath, wordCountsStr, JSON_FILE_EXTENTION);
    }
};

module.exports = phase1;
