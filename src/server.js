require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const postController = require("../controllers/postController");

const app = express();

// parsing body-text as url encoded data from Postman (or similar)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// endpoint to get all posts
app.get("/posts", postController.getAllPosts);

// endpoint to get best 5 rated posts
app.get("/posts/highest-rating", postController.getHighestRated);

// endpoint to create a post
app.post("/posts", (req, res, next) => postController.addPost(req, res, next, true), postController.getAllPosts);

// endpoint to filter posts
app.get("/post", postController.filterPosts);

// creating server
app.listen(3003, () => console.log("Server is running on port 3003"));
