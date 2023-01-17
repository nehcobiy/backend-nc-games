const { fetchAllCategories } = require("./model");

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
      response.status(200).send(reviews);
    })
    .catch(next);
};

