const fs = require("fs");
const sw = require("stopword");
const stemmer = require("./stemmer");

const getBaseLog = (x, y) => {
    return Math.log(y) / Math.log(x);
};

const getDirectories = (path) => {
    return fs
        .readdirSync(path)
        .filter((file) => fs.statSync(path + "/" + file).isDirectory());
};
const getFileNames = (folderName, extention) => {
    return fs
        .readdirSync(folderName)
        .filter(
            (file) => file.substring(file.lastIndexOf(".") + 1) == extention
        )
        .map((file) => file.substring(0, file.lastIndexOf(".")));
};

const getText = (folderName, fileName, ext) => {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
        const data = fs.readFileSync(
            `${folderName}/${fileName}.${ext}`,
            "utf8"
        );
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
                flag: "w+"
            }
        );
        //file written successfully
    } catch (err) {
        console.error(err);
    }
};

const stpToStemmer = (stpArray) =>
    stpArray.map((word) => stemmer(word)).filter((word) => word);

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
            let data = doc.wordObj;
            if (word in data) occurances[word].push(doc.name);
        });
    });
    return occurances;
};

const tableFromCounter = (docs, flag, length = null, occurances = null) => {
    let boolDocs = [];
    docs.forEach((doc) => {
        let { name, wordObj } = doc;
        let wordBool = { ...wordObj };
        if (flag == "binary") {
            for (let key in wordBool) {
                if (wordBool[key] > 1) wordBool[key] = 1;
            }
        } else {
            for (let key in wordBool) {
                const res =
                    wordBool[key] *
                    getBaseLog(
                        10,
                        length / Object.keys(occurances[key]).length
                    );
                wordBool[key] = Number.parseFloat(res).toPrecision(4);
            }
        }
        boolDocs.push({ name, wordObj: wordBool });
    });
    return boolDocs;
};

const logAsTable = (docs, words) => {
    let out = ["Files"].concat(words).join("\t") + "\n";
    docs.forEach((doc) => {
        if (!doc.wordObj) {
            return;
        }
        out += doc.name + "\t";
        words.forEach((word) => {
            if (word in doc.wordObj) out += doc.wordObj[word] + "\t";
            else {
                out += "0" + "\t";
            }
        });
        out += "\n";
    });
    console.log(out);

    return out;
};

const vectoryDistance = (docArray, queryArray) => {
    let upperSum = 0;

    for (let i = 0; i < docArray.length; i++)
        upperSum += docArray[i] * queryArray[i];

    let docSum = 0;
    let querySum = 0;
    for (let i = 0; i < queryArray.length; i++) {
        let docElem = docArray[i];
        let queryElem = queryArray[i];
        docSum += Math.pow(docElem, 2);
        querySum += Math.pow(queryElem, 2);
    }

    let lowerMult = Math.sqrt(docSum * querySum);

    let finalResult = upperSum / lowerMult;
    console.log(Number.parseFloat(finalResult).toPrecision(4));
    return Number.parseFloat(finalResult).toPrecision(4);
};

const binaryDistance = (docArray, queryArray) => {};

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
    vectoryDistance,
    getDirectories
};
