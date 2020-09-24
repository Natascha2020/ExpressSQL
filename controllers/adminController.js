const database = require("../src/dbConfig");

const adminController = {
  getAllPosts: (req, res) => {
    database
      .query("SELECT * FROM posts")
      .then((postData) => {
        res.json(postData.rows);
        res.end(postData);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(404).send("Post not found");
      });
  },
};

module.exports = adminController;
