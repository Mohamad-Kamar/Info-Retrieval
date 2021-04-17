const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
const logger = require("./middleware/logger");

app.use(logger);

//Static site files
app.use(express.static(path.join(__dirname, "public")));

//Libraries routes
app.use("/api/libraries", require("./routes/api/libraries"));

app.listen(port, () =>
  console.log("\x1b[36m%s\x1b[0m", "Server started on port " + port)
);
