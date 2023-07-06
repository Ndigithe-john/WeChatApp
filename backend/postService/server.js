const express = require("express");
require("dotenv").config();
const app = express();
const postroutes = require("./src/routes/postsroutes");

app.use(express.json());
app.use("/", postroutes);
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
