const fs = require("fs");
const sw = require("stopword");
const stemmer = require("./stemmer");

const getBaseLog = (x, y) => {
    return Math.log(y) / Math.log(x);
};

const getLibraries = (path) => {
    return fs
        .readdirSync(path)
        .filter((file) => fs.statSync(path + "/" + file).isDirectory());
};
const getFileNames = async (path, extention) => {
    return (await fs.promises.readdir(path))
        .filter(
            (file) => file.substring(file.lastIndexOf(".") + 1) == extention
        )
        .map((file) => file.substring(0, file.lastIndexOf(".")));
};

const getText = async (requestedPath, ext) => {
    try {
        const data = await fs.promises.readFile(
            `${requestedPath}.${ext}`,
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

const writeToFile = async (path, content, extention) => {
    try {
        await fs.promises.writeFile(`${path}.${extention}`, content);
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
            if (!(word in wordCounts)) {
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
    getLibraries
};
