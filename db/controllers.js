const { fetchAllCategories, fetchAllReviews } = require("./model");

exports.getCategories = (request, response, next) => {
  fetchAllCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch(next);
};

exports.getReviews = (request, response) => {
  response.status(200).send([]);
};
