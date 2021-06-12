const {
    getFileNames,
    getText,
    textToStpArray,
    stpToStemmer,
    countWords,
    writeToFile,
    getBaseLog
} = require("../utils");

const {
    TEXT_FOLDER_NAME,
    TEXT_FILE_EXTENTION,
    JSON_FILE_EXTENTION
} = require("../constants");

const path = require("path");

const phase1 = async (libName) => {
    const basePath = path.join(process.cwd(), "Libraries", libName);
    const TextPath = path.join(basePath, TEXT_FOLDER_NAME);
    let docNames = await getFileNames(TextPath, TEXT_FILE_EXTENTION);
    let allWordFreq = {};
    let docTermFreqs = [];
    // docNames.forEach((docName) => console.log(docName));

    for (let docName of docNames) {
        const docPath = path.join(TextPath, docName);
        const text = await getText(docPath, TEXT_FILE_EXTENTION);
        const stpArray = textToStpArray(text);
        const stemmedArray = stpToStemmer(stpArray);
        const stemmedSet = new Set(stemmedArray);
        for (let word of stemmedSet) {
            if (allWordFreq[word]) {
                allWordFreq[word]++;
            } else allWordFreq[word] = 1;
        }

        // const stpText = stpArray.join("\n");
        // const stemmedText = stemmedArray.join("\n");

        const wordCountsObj = countWords(stemmedArray);
        docTermFreqs.push({ docName, termFreqs: wordCountsObj });

        // const wordCountsStr = JSON.stringify(wordCountsObj, null, 2);
        // const [StpPath, SfxPath, JsonPath] = getPaths(basePath, docName);

        // writeToFile(StpPath, stpText, STP_FILE_EXTENTION);
        // writeToFile(SfxPath, stemmedText, SFX_FILE_EXTENTION);
        // writeToFile(JsonPath, wordCountsStr, JSON_FILE_EXTENTION);
    }
    docTermFreqs.forEach((doc) => {
        doc["TFIDF"] = {};
        Object.keys(doc.termFreqs).forEach((word) => {
            doc["TFIDF"][word] =
                doc.termFreqs[word] *
                getBaseLog(10, docTermFreqs.length / allWordFreq[word]);
        });
    });

    createRelevantFile(basePath, allWordFreq, docTermFreqs);
};

function createRelevantFile(basePath, allWordFreq, docTermFreqs) {
    writeToFile(
        path.join(basePath, "IDF"),
        JSON.stringify(allWordFreq, null, 2),
        JSON_FILE_EXTENTION
    );

    writeToFile(
        path.join(basePath, "TFIDF"),
        JSON.stringify(docTermFreqs, null, 2),
        JSON_FILE_EXTENTION
    );
}

module.exports = phase1;
