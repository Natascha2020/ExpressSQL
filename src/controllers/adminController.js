const database = require("../dbConfig");

const adminController = {
  getAllPosts: async (req, res) => {
    // selecting all posts and sending data to client
    // destructuring response data.rows
    const queryString = "SELECT * FROM posts ORDER BY id";

    try {
      const { rows } = await database.query(queryString);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(404).send("Post not found");
    }
  },

  getId: async (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const queryString = `SELECT * FROM posts ${id ? "WHERE id='" + id + "';" : ""} ORDER BY id`;

    try {
      const { rows } = await database.query(queryString);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(400).send("Please query valid id");
    }
  },

  updateUrl: async (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const { imageurl } = req.body;
    const queryString = `UPDATE "posts" SET ${imageurl ? "imageurl='" + imageurl + "'" : ""} WHERE id=${id} RETURNING *`;

    if (!imageurl || imageurl === "") {
      res.sendStatus(400).send("Please insert valid data");
    }

    try {
      const { rows } = await database.query(queryString);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.sendStatus(500).send("Internal Server Error");
    }
  },

  deleteId: async (req, res) => {
    // retrieve route parameter (extract id) from params object on request object
    const { id } = req.params;
    const queryString = `Delete FROM posts WHERE id=${id}`;
    // resetting serial id in table
    const resetTableIds = `BEGIN;
    LOCK posts;
    ALTER TABLE posts DROP CONSTRAINT posts_pkey;
    UPDATE posts t1
      SET    id = t2.new_id
      FROM  (SELECT id, row_number() OVER (ORDER BY id) AS new_id FROM posts) t2
      WHERE  t1.id = t2.id;
      SELECT setval('posts_id_seq', max(id)) FROM posts;
      ALTER TABLE posts ADD CONSTRAINT posts_pkey PRIMARY KEY(id); 
  COMMIT;`;

    try {
      await database.query(queryString);
      await database.query(resetTableIds);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  },
};

module.exports = adminController;
