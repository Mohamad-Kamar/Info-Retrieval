const express = require("express");
const path = require("path");

const libraries = express.Router();
const fs = require("fs");
const { getText } = require("./../../utils");

libraries.get("/:docName", (req, res) => res.json(getText(req.params.libName)));

libraries.post("/", (req, res) => {
    const dirName = req.body.name;
    const dirPath = path.join("Libraries", dirName);
    if (!libraries.find((folderName) => folderName == dirName)) {
        fs.mkdirSync(dirPath);
        libraries.push(dirName);
        res.json(libraries);
    } else {
        res.status(400).json({ message: "File Already Exists" });
    }
});

libraries.get("/:lib", (req, res) => {
    const found = libraries.find((lib) => lib == req.params.lib);
    if (found) {
        res.send(found);
    } else {
        res.status(400).send("No dir found");
    }
});

libraries.delete("/:lib", (req, res) => {
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

libraries.use("/:lib/document");

module.exports = libraries;
