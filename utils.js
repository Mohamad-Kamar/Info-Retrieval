const fs = require("fs");
const sw = require("stopword");
const stemmer = require("./stemmer");

const getText = (folderName, fileName, ext) => {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        const data = fs.readFileSync(`${folderName}/${fileName}.${ext}`, "utf8");
        // console.log(data)
        return data;
    } catch (err) {
        throw Error("Error at Reading the txt file");
    }
};

const textToStpArray = (text) => {
    try {
        const pureTextArray = text.split(/\W+/g);
        const stopTextArray = sw.removeStopwords(pureTextArray);
        return stopTextArray;
    } catch (error) {
        console.log(error);
    }
};

const countWords = (stemmedArray) => {
    let wordCountsObj = {};
    stemmedArray.forEach((word) => {
        if (word in wordCountsObj) wordCountsObj[word] += 1;
        else wordCountsObj[word] = 1;
    });
    return wordCountsObj;
};

const writeToFile = (folderName, fileName, content, extention) => {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        const data = fs.writeFileSync(`${folderName}/${fileName}.${extention}`, content, {
            flag: "w+",
        });
        //file written successfully
    } catch (err) {
        console.error(err);
    }
};

const stpToStemmer = (stpArray) =>
    stpArray.map((word) => stemmer(word)).filter((word) => word);

const getFileNames = (folderName, extention) => {
    return fs
        .readdirSync(folderName)
        .filter((file) => file.substring(file.lastIndexOf(".") + 1) == extention)
        .map((file) => file.substring(0, file.lastIndexOf(".")));
};

module.exports = {
    getFileNames,
    getText,
    textToStpArray,
    stpToStemmer,
    countWords,
    writeToFile,
};
