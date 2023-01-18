const express = require("express");
const app = express();
const { getCategories, getReviews, getReviewById } = require("./controllers");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

// app.use((err, request, response, next) => {
//   console.log(err);
//   if (err.status) {
//     response.status(err.status).send({ msg: err.msg });
//   } else {
//     next(err);
//   }
// });

app.use((err, request, response, next) => {
  console.log(err);
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request: invalid input" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(404).send({ msg: "input not found" });
});
module.exports = app;
