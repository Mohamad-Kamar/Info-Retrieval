const fs = require('fs');
const { getFileNames, getText, textToStpArray, stpToStemmer, countWords, writeToFile } = require('./utils')

const SAMPLE_TEXT_FOLDER_NAME = './SampleTexts';
const STP_FOLDER_NAME = './StpFiles'
const SFX_FOLDER_NAME = './SfxFiles'
const JSON_FOLDER_NAME = './JSONFiles'

function main() {

    let fileNames = getFileNames(SAMPLE_TEXT_FOLDER_NAME);

    fileNames.forEach(fileName => console.log(fileName))

    for (let fileName of fileNames) {
        const text = getText(SAMPLE_TEXT_FOLDER_NAME, fileName);


        const stpArray = textToStpArray(text);
        const stemmedArray = stpToStemmer(stpArray);


        const stpText = stpArray.join("\n");
        const stemmedWords = stemmedArray.join('\n');

        const wordCountsObj = countWords(stemmedArray);

        const wordCountsStr = JSON.stringify(wordCountsObj, null, 2)

        writeToFile(STP_FOLDER_NAME, fileName, stpText);
        writeToFile(SFX_FOLDER_NAME, fileName, stemmedWords);
        writeToFile(JSON_FOLDER_NAME, fileName, wordCountsStr);
    }

}

main()