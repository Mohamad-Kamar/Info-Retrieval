const fs = require("fs");
const sw = require("stopword");
const stemmer = require("./stemmer");


const getBaseLog = (x, y) => {
    return Math.log(y) / Math.log(x);
};


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
        const data = fs.writeFileSync(
            `${folderName}/${fileName}.${extention}`,
            content,
            {
                flag: "w+",
            }
        );
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

const getFilledEmptyWords = (docCountArray, allWordCounts) => {
    let completeWordCounts = { ...docCountArray };
    completeWordCounts.forEach((doc) => {
        let wordCounts = doc.wordCounts;
        Object.keys(allWordCounts).forEach((word) => {
            if (!word in wordCounts) {
                wordCounts[word] = 0;
            }
        });
    });
    return completeWordCounts;
};

const getTermFreq = (allWordCounts, docCountArray) => {
    let occurances = {};
    Object.keys(allWordCounts).forEach((word) => {
        occurances[word] = [];
        docCountArray.forEach((doc) => {
            let data = doc.wordCounts;
            if (word in data) occurances[word].push(doc.name);
        });
    });
    return occurances;
};

const tableFromCounter = (docs, flag, length = null, occurances = null) => {
    let boolDocs = [];
    docs.forEach((doc) => {
        let { name, wordCounts } = doc;
        let wordBool = { ...wordCounts };
        if (flag == "binary") {
            for (let key in wordBool) {
                if (wordBool[key] > 1) wordBool[key] = 1;
            }
        } else {
            for (let key in wordBool) {
                const res =
                    wordBool[key] *
                    getBaseLog(10, length / Object.keys(occurances[key]).length);
                wordBool[key] = Number.parseFloat(res).toPrecision(4);
            }
        }
        boolDocs.push({ name, wordBools: wordBool });
    });
    return boolDocs;
};

const logAsTable = (allWordsArray, docCountArray) => { };

module.exports = {
    getBaseLog,
    getFileNames,
    getText,
    textToStpArray,
    stpToStemmer,
    countWords,
    writeToFile,
    logAsTable,
    getTermFreq,
    getFilledEmptyWords,
    tableFromCounter,
};
