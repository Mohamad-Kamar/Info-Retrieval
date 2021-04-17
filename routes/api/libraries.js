const express = require("express");
const router = express.Router();
const fs = require("fs");
const { getDirectories } = require("./../../utils");

const libraries = getDirectories("Libraries");

router.get("/", (req, res) => res.json(libraries));

router.post("/", (req, res) => {
  const dirName = req.body.name;
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
    libraries.push(dirName);
    res.json(libraries);
  } else {
    res.status(404);
  }
});

router.get("/:lib", (req, res) => {
  const found = libraries.filter((lib) => lib == req.params.lib);
  if (found.length) {
    res.send(found);
  } else {
    res.status(400).send("No dir found");
  }
});

module.exports = router;
