const db = require("./connection");

exports.fetchAllCategories = () => {
  return db.query(`SELECT * FROM categories`).then((response) => {
    return response.rows;
  });
};

exports.fetchAllReviews = () => {
  const query = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC
  `;
  return db.query(query).then((response) => {
    return response.rows;
  });
};

exports.fetchReviewById = (id) => {
  const query = `SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at 
  FROM reviews
  WHERE review_id = $1`;

  return db.query(query, [id]).then(({ rowCount, rows }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404 });
    } else {
      return rows[0];
    }
  });
};

exports.fetchCommentsByReviewId = (id) => {
  const query = `SELECT comment_id, votes, created_at, author, body, review_id
  FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC`;

  return db.query(query, [id]).then((response) => {
    if (response.rows.length === 0) {
      return ["no comments with this review_id"];
    } else return response.rows;
  });
};
