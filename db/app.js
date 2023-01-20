const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  patchReview,
  getUsers,
} = require("./controllers");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.use(express.json());

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/users", getUsers);

app.use((err, request, response, next) => {
  console.log(err);
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});
app.use((err, request, response, next) => {
  console.log(err);
  if (err.code === "23502") {
    response.status(400).send({ msg: "Bad request: body must not be empty" });
  } else {
    next(err);
  }
  app.use((err, request, response, next) => {
    console.log(err);
    response.status(404).send({ msg: "input not found" });
  });
});
module.exports = app;
