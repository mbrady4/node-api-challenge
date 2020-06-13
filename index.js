// Hello Worldcd
require("dotenv").config();
const express = require("express");
const actionRoutes = require("./routes/actionRoutes");
const projectRoutes = require("./routes/projectRoutes");

const server = express();
const port = process.env.PORT;

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h1>Let's get it!</h1>`);
});

server.use("/api/actions", actionRoutes);
server.use("/api/projects", projectRoutes);

server.get("/*", (req, res) => {
  res.status(404).json({ message: "The route requested does not exist" });
});

server.listen(port, () => console.log(`Blog API running on port ${port}`));

module.exports = server;
