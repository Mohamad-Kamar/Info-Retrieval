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

docRouter.get("/search/:query", async (req, res) => {
    const query = req.params.query;
    //stemm and stuff the query
    const queryStpArray = textToStpArray(query);
    const queryStemmedArray = stpToStemmer(queryStpArray);
    let queryTermFreq = countWords(queryStemmedArray);
    //compare with each document and create list of scores
    const libName = req.params.libName;
    const TFIDFPath = path.join(
        "Libraries",
        req.params.libName,
        "Term Frequencies"
    );
    const docTermFreqs = JSON.parse(
        await getText(
            path.join(
                "Libraries",
                req.params.libName,
                "Inverse Document Frequency"
            ),
            "json"
        )
    );
    const TFIDF = JSON.parse(await getText(TFIDFPath, "json"));

    let queryTFIDF = {};
    for (let key of Object.keys(queryTermFreq)) {
        queryTFIDF[key] =
            queryTermFreq[key] *
            getBaseLog(10, TFIDF.length / docTermFreqs[key]);
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
        // console.log(numer);
        // console.log(deno);
        // console.log("==================================");
        queryScores.push(obj);
    });
    console.log(queryScores);
    //sort documents according to score

    //return results to user
    // let requestedPath = path.join("Libraries", req.params.libName, "Text");
    // docs = await getFileNames(requestedPath, "txt");
    res.status(200).json(
        Object.keys(queryScores)
            .filter((key) => queryScores[key]["cosScore"])
            .map((key) => {
                return {
                    "Document Name": queryScores[key]["docName"],
                    "Cosine Score": queryScores[key]["cosScore"]
                };
            })
            .sort((a, b) => b["Cosine Score"] - a["Cosine Score"])
    );
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
