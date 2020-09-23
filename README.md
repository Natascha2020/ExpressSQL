# ExpressSQL

# Stack

- [Node.js](https://nodejs.org/)
- GIT/GITHUB (code management)
- [ElephantSQL](https://www.elephantsql.com/) (PostgreSQL database)

# How to run locally

- System requirements: [Node.js](https://nodejs.org/)
- Fork the repository
- Clone it to your local repo
- Run "npm install" to install dependencies
  - "body-parser": "^1.19.0",
  - "dotenv": "^8.2.0",
  - "express": "^4.17.1",
  - "nodemon": "^2.0.4",
  - "pg": "^8.3.3"
- Run "npm start" to run local server
- See .env.sample for environment variables

# Features

| Endpoint                             | Route                                                 |
| ------------------------------------ | ----------------------------------------------------- |
| GET (all posts from database)        | ("/posts")                                            |
| GET (the best 5 rates posts)         | ("/posts/highest-rating")                             |
| POST (a new post to database)        | ("/posts")                                            |
| GET (filter a post via query string) | ("/posts/filter/?continent={continent}&limit={limit}" |

# Structure

| File              | Description                             |
| ----------------- | --------------------------------------- |
| server.js         | Server and endpoints                    |
| dbConfig.js       | Configuration of database (ElephantSQL) |
| postController.js | Controllers                             |

# Credits

- Pictures are CC0 Creative Commons, attribution free, taken from:[Pixabay](https://pixabay.com/)
- Node-graph is created with the free online tool by [yworks](https://live.yworks.com/demos/layout/layoutstyles/index.html)
