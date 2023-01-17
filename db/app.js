const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers");

app.get("/api/categories", getCategories);

app.use((err, request, response, next) => {
  console.log(err);
});

module.exports = app;
