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
  removeComment,
} = require("./model");

const { endpoints } = require("../endpoints");

exports.getCategories = (request, response, next) => {
  fetchAllCategories()
    .then((categories) => {
      response.status(200).send({ categories: categories });
    })
    .catch(next);
};

exports.getReviews = (request, response, next) => {
  if (request.query.hasOwnProperty("sort_by")) {
    if (request.query.hasOwnProperty("order")) {
      const { sort_by } = request.query;
      const { order } = request.query;
      sortReviews(sort_by, order)
        .then((reviews) => {
          response.status(200).send({ reviews: reviews });
        })
        .catch(next);
    } else {
      const { sort_by } = request.query;
      sortReviews(sort_by)
        .then((reviews) => {
          response.status(200).send({ reviews: reviews });
        })
        .catch(next);
    }
  }
  if (request.query.hasOwnProperty("category")) {
    const { category } = request.query;
    Promise.all([categoryExistence(category), searchByReviewCategory(category)])
      .then((results) => {
        response.status(200).send({ reviews: results[1] });
      })
      .catch(next);
  } else if (
    !request.query.hasOwnProperty("sort_by") &&
    !request.query.hasOwnProperty("category")
  ) {
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
      response.status(200).send({ comments: comments });
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
    response.status(200).send({ users: users });
  });
};

exports.deleteComment = (request, response) => {
  const { comment_id } = request.params;
  removeComment(comment_id).then(() => {
    response.status(204).send();
  });
};

exports.getApi = (request, response) => {
  response.status(200).json(endpoints);
};

exports.getInitial = (request, response) => {
  response
    .status(200)
    .send({
      message: "go to path /api to see description of available endpoints",
    });
};
