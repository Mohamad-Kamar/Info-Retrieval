const express = require("express");
const path = require("path");

const docRouter = express.Router({ mergeParams: true });
const fs = require("fs");
const { getText, getFileNames, writeToFile } = require("./../../utils");

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
    const docPath = path.join("Libraries", req.params.libName, docName);
    fs.closeSync(fs.openSync(docPath + ".txt", "w"));
    libraries.push(dirName);
    res.json(libraries);
    res.status(400).json({ message: "File Already Exists" });
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
