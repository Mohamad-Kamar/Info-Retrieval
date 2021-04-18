const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const logger = require("./middleware/logger");

app.use(logger);

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Static site files
app.use(express.static(path.join(__dirname, "public")));

//Libraries routes
app.use("/api/libraries", require("./routes/api/libraries"));
app.use("/api/searchAll", require("./routes/api/searchAll"));

app.listen(port, () =>
    console.log("\x1b[36m%s\x1b[0m", "Server started on port " + port)
);
