const fs = require('fs');
const sw = require('stopword')
const stemmer = require('./stemmer');


const SAMPLE_TEXT_FOLDER_NAME = './SampleTexts';
const STP_FOLDER_NAME = './StpFiles'
const SFX_FOLDER_NAME = './SfxFiles'
const JSON_FOLDER_NAME = './JSONFiles'

function main() {

    let fileNames = fs.readdirSync(SAMPLE_TEXT_FOLDER_NAME)
        .filter(file => file.substring(file.lastIndexOf('.') + 1) == 'txt')
        .map(file => file.substring(0, file.lastIndexOf('.')));

    fileNames.forEach(fileName => console.log(fileName))

    for (let fileName of fileNames) {
        const text = getText(fileName);


        const stpArray = textToStpArray(text);
        const stemmedArray = stpArray.map(word => stemmer(word)).filter(word => word);


        const stpText = stpArray.join("\n");
        const stemmedWords = stemmedArray.join('\n');

        const wordCountsObj = countWords(stemmedArray);

        const wordCountsStr = JSON.stringify(wordCountsObj, null, 2)

        writeToFile(STP_FOLDER_NAME, fileName, stpText);
        writeToFile(SFX_FOLDER_NAME, fileName, stemmedWords);
        writeToFile(JSON_FOLDER_NAME, fileName, wordCountsStr);
    }

}
function getText(fileName) {
    try {
        if (!fs.existsSync(SAMPLE_TEXT_FOLDER_NAME)) {
            fs.mkdirSync(SAMPLE_TEXT_FOLDER_NAME);
        }
        const data = fs.readFileSync(`${SAMPLE_TEXT_FOLDER_NAME}/${fileName}.txt`, 'utf8')
        // console.log(data)
        return data;
    }
    catch (err) {
        throw Error("Error at Reading the txt file")
    }
}


function textToStpArray(text) {
    try {
        const pureTextArray = text.split(/\W+/g);
        const stopTextArray = sw.removeStopwords(pureTextArray);
        return stopTextArray;
    }
    catch (error) {
        console.log(error);
    }

}


function countWords(stemmedArray) {
    let wordCountsObj = {};
    stemmedArray.forEach(word => {
        if (word in wordCountsObj)
            wordCountsObj[word] += 1
        else
            wordCountsObj[word] = 1
    })
    return wordCountsObj;
}

function writeToFile(folderName, fileName, content) {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        const data = fs.writeFileSync(`${folderName}/${fileName}.json`, content, { flag: 'w+' });
        //file written successfully
    } catch (err) {
        console.error(err)
    }
}
main()



