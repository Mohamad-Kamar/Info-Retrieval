const express = require("express");
const path = require("path");

const docRouter = express.Router({ mergeParams: true });
const fs = require("fs");
const {
    getText,
    getFileNames,
    writeToFile,
    textToStpArray,
    stpToStemmer,
    countWords,
    getBaseLog
} = require("./../../utils");

let latestFound = [];
docRouter.get("/", async (req, res) => {
    let docs;
    try {
        let requestedPath = path.join("Libraries", req.params.libName, "Text");
        docs = await getFileNames(requestedPath, "txt");
        res.status(200).json(docs);
    } catch (e) {
        console.error(e.message);
        res.status(400).json({ msg: "Requested Library not found" });
    }
});

docRouter.post("/relevance", async (req, res) => {
    let releventNames = new Set(req.body.devices);
    let relevantRetrieved = 0;
    let retrieved = 0;
    let returnedArray = latestFound.map((doc, idx) => {
        let docName = doc["Document Name"];
        if (releventNames.has(docName)) {
            relevantRetrieved++;
            retrieved++;
            let precision = relevantRetrieved / retrieved;
            let recall = relevantRetrieved / releventNames.size;
            return {
                Rank: idx + 1,
                Recall: Number.parseFloat(recall).toPrecision(4),
                Precision: Number.parseFloat(precision).toPrecision(4)
            };
        } else {
            retrieved++;
            return {
                Rank: idx + 1,
                Recall: 0,
                Precision: 0
            };
        }
    });
    res.status(200).json(returnedArray);
});

docRouter.get("/search/:query", async (req, res) => {
    const query = req.params.query;
    //stemm and stuff the query
    const queryStpArray = textToStpArray(query);
    const queryStemmedArray = stpToStemmer(queryStpArray);
    let queryTermFreq = countWords(queryStemmedArray);
    //compare with each document and create list of scores
    const libName = req.params.libName;
    const TFIDFPath = path.join("Libraries", libName, "TFIDF");
    const docTermFreqs = JSON.parse(
        await getText(path.join("Libraries", libName, "IDF"), "json")
    );
    const TFIDF = JSON.parse(await getText(TFIDFPath, "json"));

    let queryTFIDF = {};
    for (let key of Object.keys(queryTermFreq)) {
        if (key in docTermFreqs) {
            let val =
                queryTermFreq[key] *
                getBaseLog(10, TFIDF.length / docTermFreqs[key]);
            queryTFIDF[key] = val ? val : 0;
        }
    }

    // console.log(queryTFIDF);

    const queryScores = [];
    TFIDF.forEach((elem) => {
        let obj = { docName: elem.docName };
        let numer = Object.keys(docTermFreqs).reduce((acc, curr) => {
            const elemCurr = +elem["TFIDF"][curr] ? +elem["TFIDF"][curr] : 0;
            const queryCurr = +queryTFIDF[curr] ? +queryTFIDF[curr] : 0;
            let val = elemCurr * queryCurr + acc;
            // console.log(queryCurr);
            return val;
        }, 0);
        let deno = Math.sqrt(
            Object.keys(elem["TFIDF"]).reduce(
                (acc, curr) =>
                    acc +
                    Math.pow(
                        +elem["TFIDF"][curr] ? +elem["TFIDF"][curr] : 0,
                        2
                    ),
                0
            ) *
                Object.keys(queryTFIDF).reduce(
                    (acc, curr) =>
                        acc +
                        Math.pow(+queryTFIDF[curr] ? +queryTFIDF[curr] : 0, 2),
                    0
                )
        );
        obj["cosScore"] = numer / deno;
        queryScores.push(obj);
    });
    // console.log(queryScores);
    //sort documents according to score
    let response = Object.keys(queryScores)
        .filter((key) => queryScores[key]["cosScore"])
        .map((key) => {
            return {
                "Document Name": queryScores[key]["docName"],
                "Cosine Score": queryScores[key]["cosScore"]
            };
        })
        .sort((a, b) => b["Cosine Score"] - a["Cosine Score"]);
    latestFound = [...response];
    res.status(200).json(response);
});
docRouter.get("/:docName", async (req, res) => {
    const libName = req.params.libName;
    const docName = req.params.docName;
    let requestedText;
    try {
        let requestedPath = path.join("Libraries", libName, "Text", docName);
        requestedText = await getText(requestedPath, "txt");
        return res.status(200).send(requestedText);
    } catch (err) {
        res.status(404).json({ msg: err.message });
    }
});

docRouter.post("/", async (req, res) => {
    const docName = req.body.docName;
    const docPath = path.join("Libraries", req.params.libName, "Text", docName);
    try {
        fs.closeSync(fs.openSync(docPath + ".txt", "w"));
        res.status(201);
    } catch {
        res.status(400).json({ message: "File Already Exists" });
    }
});

docRouter.put("/:docName", async (req, res) => {
    let content = req.body.content;
    let docName = req.params.docName;
    let libName = req.params.libName;
    const docPath = path.join("Libraries", libName, "Text", docName);
    writeToFile(docPath, content, "txt");
});

docRouter.delete("/:docName", (req, res) => {
    let docName = req.params.docName;
    let libName = req.params.libName;
    const docPath = path.join("Libraries", libName, docName);
    fs.promises.rm(docPath);
});

module.exports = docRouter;
