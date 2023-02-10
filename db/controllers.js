const {
  fetchAllCategories,
  fetchAllReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertComment,
  updateReview,
  fetchAllUsers,
  searchByReviewCategory,
  categoryExistence,
  sortReviews,
} = require("./model");

exports.getCategories = (request, response, next) => {
  fetchAllCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch(next);
};

exports.getReviews = (request, response, next) => {
  if (request.query.hasOwnProperty("order")) {
    const { sort_by } = request.query;
    const { order } = request.query;
    sortReviews(sort_by, order)
      .then((reviews) => {
        response.status(200).send({ reviews: reviews });
      })
      .catch(next);
  }
  if (request.query.hasOwnProperty("sort_by")) {
    const { sort_by } = request.query;
    sortReviews(sort_by)
      .then((reviews) => {
        response.status(200).send({ reviews: reviews });
      })
      .catch(next);
  }
  if (request.query.hasOwnProperty("category")) {
    const { category } = request.query;
    Promise.all([categoryExistence(category), searchByReviewCategory(category)])
      .then((results) => {
        response.status(200).send({ reviews: results[1] });
      })
      .catch(next);
  } else {
    fetchAllReviews()
      .then((reviews) => {
        response.status(200).send({ reviews });
      })
      .catch(next);
  }
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
      response.status(200).send(comments);
    })
    .catch(next);
};

exports.postComment = (request, response, next) => {
  const newComment = request.body;
  const { review_id } = request.params;
  Promise.all([
    fetchReviewById(review_id),
    insertComment(newComment, review_id),
  ])
    .then((results) => {
      response.status(201).send(results[1]);
    })
    .catch(next);
};

exports.patchReview = (request, response, next) => {
  const body = request.body;
  const { review_id } = request.params;
  Promise.all([fetchReviewById(review_id), updateReview(body, review_id)])
    .then((results) => {
      response.status(200).send({ review: results[1] });
    })
    .catch(next);
};

exports.getUsers = (request, response, next) => {
  fetchAllUsers().then((users) => {
    response.status(200).send(users);
  });
};
