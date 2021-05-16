const express = require("express");
const path = require("path");
const p1 = require("./../../phases/phase1");
const libRouter = express.Router();
const docRouter = require("./documents");
const fs = require("fs");
const { getLibraries, getFileNames } = require("./../../utils");

let libraries = getLibraries(path.join("Libraries"));

libRouter.get("/", (req, res) => {
    libraries = getLibraries(path.join("Libraries"));
    return res.json(libraries);
});
libRouter.get("/:libName", async (req, res) => {
    let docs;
    try {
        let requestedPath = path.join("Libraries", req.params.libName, "Text");
        docs = await getFileNames(requestedPath, "txt");
        await p1(req.params.libName);
        res.status(200).json(docs);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Requested Library not found" });
    }
});

libRouter.post("/", async (req, res) => {
    const libName = req.body.name;
    const libPath = path.join("Libraries", libName);
    if (!libraries.find((folderName) => folderName == libName)) {
        await fs.promises.mkdir(libPath);
        Promise.all([
            fs.promises.mkdir(path.join(libPath, "Text")),
            fs.promises.mkdir(path.join(libPath, "Stp")),
            fs.promises.mkdir(path.join(libPath, "Sfx"))
        ])
            .then(() => {
                libraries.push(libName);
                res.status(201).json(libraries);
            })
            .catch((e) => console.log(e));
    } else {
        res.status(400).json({ message: "File Already Exists" });
    }
});

libRouter.delete("/:libName", async (req, res) => {
    const found = libraries.find((libName) => libName == req.params.libName);
    if (found) {
        const libPath = path.join("Libraries", found);
        libraries = libraries.filter((name) => name != found);
        await fs.promises.rmdir(libPath, { recursive: true });
        res.send(found);
    } else {
        res.status(400).send("No dir found");
    }
});
libRouter.use("/:libName/document", docRouter);

module.exports = libRouter;
