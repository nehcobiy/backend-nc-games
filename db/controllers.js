const {
  fetchAllCategories,
  fetchAllReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
} = require("./model");

exports.getCategories = (request, response, next) => {
  fetchAllCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch(next);
};

exports.getReviews = (request, response, next) => {
  fetchAllReviews()
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewById(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (request, response, next) => {
  const { review_id } = request.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      console.log(comments);
      response.status(200).send(comments);
    })
    .catch(next);
};
