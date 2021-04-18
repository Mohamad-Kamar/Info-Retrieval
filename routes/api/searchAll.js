const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
router.get("/", (req, res) => res.json({ value: "value" }));

module.exports = router;
