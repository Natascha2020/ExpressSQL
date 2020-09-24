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

  getId: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;

    const queryString = `SELECT * FROM posts ${id ? "WHERE id='" + id + "';" : ""}`;
    database
      .query(queryString)
      .then((filteredData) => {
        res.json(filteredData.rows);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(400).send("Please query valid data");
      });
  },

  updateUrl: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const { imageurl } = req.body;

    const queryString = `UPDATE "posts" SET ${imageurl ? "imageurl='" + imageurl + "'" : ""} WHERE id=${id} RETURNING *`;
    console.log(queryString);
    if (!imageurl || imageurl === "") {
      res.sendStatus(400).send("Please insert valid data");
    }
    database
      .query(queryString)
      .then((queryData) => {
        res.json(queryData.rows);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  },

  deleteId: (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const queryString = `Delete FROM posts WHERE id=${id}`;
    database
      .query(queryString)
      .then((filteredData) => {
        console.log(filteredData.rows);
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(400).send("Please query valid data");
      });
  },
};

module.exports = adminController;
