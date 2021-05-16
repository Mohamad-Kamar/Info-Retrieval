const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const logger = require("./middleware/logger");

// app.use(logger);

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Static site files
// app.use(express.static(path.join(__dirname, "public")));

//index page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index", "index.html"));
});
app.get("/index.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index", "index.js"));
});

//Libraries page
app.get("/libraries", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "libraries", "libraries.html"));
});
app.get("/libraries.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "libraries", "libraries.js"));
});

//documents page
app.get("/libraries/:libName/documents", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "documents", "documents.html"));
});
app.get("/documents.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "documents", "documents.js"));
});

//Signle document page
app.get("/libraries/:libName/documents/:docName/document", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "singleDoc", "singleDoc.html"));
});
app.get("/singleDoc.js", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "singleDoc,", "singleDoc.js"));
});

//about page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about", "about.html"));
});

//css
app.get("/css/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "css", "style.css"));
});

//API routes
app.use("/api/libraries", require("./routes/api/libraries"));
app.use("/api/searchAll", require("./routes/api/searchAll"));

app.listen(port, () =>
    console.log("\x1b[36m%s\x1b[0m", "Server started on port " + port)
);
