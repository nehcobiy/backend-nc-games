const express = require("express");
const app = express();
const { getCategories } = require("./controllers");
module.exports = app;

app.get("/api/categories", getCategories);

app.use((err, request, response, next) => {
  console.log(err);
});
