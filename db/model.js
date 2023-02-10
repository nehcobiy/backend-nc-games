const e = require("express");
const { response } = require("express");
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
      return Promise.reject({
        status: 404,
        msg: "this id does not exist",
      });
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

  return db.query(query, [id]).then(({ rowCount, rows }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "no comments exist for this id",
      });
    } else return rows;
  });
};

exports.insertComment = (newComment, id) => {
  const query = `INSERT INTO comments (body, author, review_id) VALUES ($1, (SELECT username FROM users WHERE username = $2), $3) RETURNING *;`;
  return db
    .query(query, [newComment.body, newComment.username, id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateReview = (body, id) => {
  const query = `UPDATE reviews 
  SET votes = $1 + votes 
  WHERE review_id = $2 
  RETURNING *`;
  return db.query(query, [body.inc_votes, id]).then(({ rowCount, rows }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "this id does not exist",
      });
    }
    if (Object.keys(body).length > 1) {
      return Promise.reject({
        status: 400,
        msg: "Bad request: body must not contain other properties",
      });
    } else return rows[0];
  });
};

exports.fetchAllUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users`)
    .then((response) => {
      return response.rows;
    });
};

exports.categoryExistence = (category) => {
  return this.fetchAllCategories().then((allCategories) => {
    let containCategory = false;
    allCategories.forEach((existingCategory) => {
      if (existingCategory.slug === category) {
        containCategory = true;
      }
    });
    if (containCategory === false) {
      return Promise.reject({
        status: 404,
        msg: "category does not exist",
      });
    }
  });
};

exports.searchByReviewCategory = (category) => {
  const query = `SELECT * FROM reviews WHERE category = $1`;
  return db.query(query, [category]).then((response) => {
    if (response.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "no reviews exists for this category",
      });
    } else {
    }
    return response.rows;
  });
};

exports.sortReviews = (coloumn, order) => {
  if (coloumn === "comment_count" && !order) {
    const query = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY comment_count DESC;`;
    return db.query(query).then((response) => {
      return response.rows;
    });
  }

  if (coloumn === "comment_count" && ["asc", "desc"].includes(order)) {
    const query = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY comment_count ${order};`;
    return db.query(query).then((response) => {
      return response.rows;
    });
  }
  if (!coloumn) {
    const query = `SELECT * FROM reviews ORDER BY created_at`;
    return db.query(query).then((response) => {
      return response.rows;
    });
  }
  if (
    ![
      "title",
      "designer",
      "owner",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
      "comment_count",
    ].includes(coloumn)
  ) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  if (coloumn && !order) {
    const query = `SELECT * FROM reviews ORDER BY ${coloumn} DESC ;`;
    return db.query(query).then((response) => {
      return response.rows;
    });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  } else {
    const query = `SELECT * FROM reviews ORDER BY ${coloumn} ${order};`;
    return db.query(query).then((response) => {
      return response.rows;
    });
  }
};
