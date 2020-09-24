require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const postRoutes = require("../routes/postRoutes");

const app = express();

// parsing body-text as url encoded data received from client (test via Postman or similar)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/posts", postRoutes);

// creating server running on port 3003
app.listen(3003, () => console.log("Server is running on port 3003"));
