const express = require("express");
const path = require("path");

const router = express.Router();
const fs = require("fs");
const { getDirectories, getFileNames } = require("./../../utils");

let libraries = getDirectories("Libraries");

router.get("/", (req, res) => res.json(libraries));

router.get("/:lib", (req, res) => {
    let docs;
    try {
        let requestedPath = path.join("Libraries", req.params.lib);
        docs = getFileNames(requestedPath, "txt");
        console.log(docs);
        res.status(200).send(docs);
    } catch {
        res.status(400);
        console.log("Library Not Found");
    }
});

router.post("/", (req, res) => {
    const dirName = req.body.name;
    const dirPath = path.join("Libraries", dirName);
    if (!libraries.find((folderName) => folderName == dirName)) {
        fs.mkdirSync(dirPath);
        libraries.push(dirName);
        res.status(201).json(libraries);
    } else {
        res.status(400).json({ message: "File Already Exists" });
    }
});

router.delete("/:lib", (req, res) => {
    const found = libraries.find((lib) => lib == req.params.lib);
    if (found) {
        const dirPath = path.join("Libraries", found);
        libraries = libraries.filter((name) => name != found);
        fs.rmdirSync(dirPath, { recursive: true });
        res.send(found);
    } else {
        res.status(400).send("No dir found");
    }
});

module.exports = router;
