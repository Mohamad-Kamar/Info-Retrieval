const express = require("express");
const path = require("path");
const app = express();
const { getDirectories } = require("./utils");
const port = process.env.PORT || 5000;

app.get("/api/libraries", (req, res) =>
  res.send(getDirectories("./Libraries"))
);
app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () =>
  console.log("\x1b[36m%s\x1b[0m", "Server started on port " + port)
);
