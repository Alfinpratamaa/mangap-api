const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet").default;
const { router } = require("./routes/router");
const path = require("path");
require("dotenv").config();

app.use(cors());
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  //set static <folder></folder>
  app.use(express.static("/"));
}
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.use(router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
