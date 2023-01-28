const app = require("../db/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("GET: /api/categories", () => {
    test("status: 200", () => {
      return request(app).get("/api/categories").expect(200);
    });
    test("responds with an array", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
        });
    });
    test("all objects returned in array", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(4);
        });
    });
    test("array of category objects contain the correct properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          body.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("GET: /api/reviews", () => {
    test("status: 200", () => {
      return request(app).get("/api/reviews").expect(200);
    });
    test("responds with reviews object containing reviews array", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.reviews)).toBe(true);
        });
    });
    test("all objects returned in array", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews.length).toBe(13);
        });
    });
    test("array contains objects with correct properties", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews.length).toBe(13);
          body.reviews.forEach((review) => {
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("review_id", expect.any(Number));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("comment_count");
          });
        });
    });
    test("reviews sorted in descending order of date", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("GET: /api/reviews/:review_id", () => {
    test("status: 200", () => {
      return request(app).get("/api/reviews/1").expect(200);
    });
    test("returns review object containing the correct properties", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toHaveProperty("review_id", expect.any(Number));
          expect(body.review).toHaveProperty("title", expect.any(String));
          expect(body.review).toHaveProperty("review_body", expect.any(String));
          expect(body.review).toHaveProperty("designer", expect.any(String));
          expect(body.review).toHaveProperty(
            "review_img_url",
            expect.any(String)
          );
          expect(body.review).toHaveProperty("votes", expect.any(Number));
          expect(body.review).toHaveProperty("category", expect.any(String));
          expect(body.review).toHaveProperty("owner", expect.any(String));
          expect(body.review).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("returns the correct review", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            votes: 1,
            category: "euro game",
            owner: "mallionaire",
            created_at: `2021-01-18T10:00:20.514Z`,
          });
        });
    });
    test("status: 400 bad request, invalid ID type", () => {
      return request(app)
        .get("/api/reviews/notAnID")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status: 404 not found, valid ID but does not exist", () => {
      return request(app)
        .get("/api/reviews/9999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("this id does not exist");
        });
    });
  });
  describe("GET: /api/reviews/:review_id/comments", () => {
    test("status: 200", () => {
      return request(app).get("/api/reviews/2/comments").expect(200);
    });
    test("responds with an array", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
        });
    });
    test("comment object contains the correct properties", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          body.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("review_id", expect.any(Number));
          });
        });
    });
    test("correct length array returned", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
        });
    });
    test("comments sorted from most recent", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status:400, invalid path", () => {
      return request(app)
        .get("/api/reviews/notAnID/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status: 404, valid ID but comment does not exist", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("no comments exist for this id");
        });
    });
  });
  describe("POST: /api/reviews/:review_id/comments", () => {
    test("adds new comment to database with correct properties", () => {
      const newComment = {
        username: "mallionaire",
        body: "this is a test comment",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toHaveProperty("comment_id", expect.any(Number));
          expect(body).toHaveProperty("body", expect.any(String));
          expect(body).toHaveProperty("votes", expect.any(Number));
          expect(body).toHaveProperty("author", expect.any(String));
          expect(body).toHaveProperty("review_id", expect.any(Number));
          expect(body).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("responds with correct posted comment", () => {
      const newComment = {
        username: "mallionaire",
        body: "this is a test comment",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.author).toBe("mallionaire");
          expect(body.body).toBe("this is a test comment");
          expect(body.comment_id).toBe(7);
          expect(body.review_id).toBe(1);
          expect(body.votes).toBe(0);
          expect(body.created_at).toEqual(expect.any(String));
        });
    });
    test("status: 400, invalid review id", () => {
      const newComment = {
        username: "mallionaire",
        body: "this is a test comment",
      };
      return request(app)
        .post("/api/reviews/notAnID/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status:400, invalid body", () => {
      const newComment = {
        username: "notUser",
        body: "this is a test comment",
      };
      return request(app)
        .post("/api/reviews/notAnID/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH: /api/reviews/:review_id", () => {
    test("responds with review object with the correct properties", () => {
      const update = { inc_votes: 50 };
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toHaveProperty("review_id", expect.any(Number));
          expect(body.review).toHaveProperty("title", expect.any(String));
          expect(body.review).toHaveProperty("review_body", expect.any(String));
          expect(body.review).toHaveProperty("designer", expect.any(String));
          expect(body.review).toHaveProperty(
            "review_img_url",
            expect.any(String)
          );
          expect(body.review).toHaveProperty("votes", expect.any(Number));
          expect(body.review).toHaveProperty("category", expect.any(String));
          expect(body.review).toHaveProperty("owner", expect.any(String));
          expect(body.review).toHaveProperty("created_at", expect.any(String));
        });
    });
    test("responds with review with updated values - add", () => {
      const update = { inc_votes: 50 };
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            votes: 51,
            category: "euro game",
            owner: "mallionaire",
            created_at: `2021-01-18T10:00:20.514Z`,
          });
        });
    });
    test("responds with review with updated values - minus", () => {
      const update = { inc_votes: -1 };
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
            votes: 0,
            category: "euro game",
            owner: "mallionaire",
            created_at: `2021-01-18T10:00:20.514Z`,
          });
        });
    });
    test("status: 400, invalid review_id", () => {
      const update = { inc_votes: 50 };
      return request(app)
        .patch("/api/reviews/notAnId")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status: 404, valid but nonexistent review_id", () => {
      const update = { inc_votes: 50 };
      return request(app)
        .patch("/api/reviews/99999")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("this id does not exist");
        });
    });
    test("status: 400, no inc_votes on request body", () => {
      const update = {};
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request: body must not be empty");
        });
    });
    test("status: 400, invalid inc_votes on body", () => {
      const update = { inc_votes: "cats" };
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("status: 400, body includes other properties", () => {
      const update = { inc_votes: 1, name: "cat" };
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Bad request: body must not contain other properties"
          );
        });
    });
  });
  describe("GET: /api/users", () => {
    test("returns an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
        });
    });
    test("each user object contains the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBeGreaterThan(0);
          body.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
    test("all objects returned in array", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(4);
        });
    });
  });
  describe("GET: /api/reviews, queries", () => {
    describe("category query", () => {
      test("responds with an array of reviews", () => {
        return request(app)
          .get("/api/reviews/?category=dexterity")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.reviews)).toBe(true);
          });
      });
      test("each review object contains the right properties", () => {
        return request(app)
          .get("/api/reviews/?category=social+deduction")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBeGreaterThan(0);
            body.reviews.forEach((review) => {
              expect(review).toHaveProperty("title", expect.any(String));
              expect(review).toHaveProperty("designer", expect.any(String));
              expect(review).toHaveProperty("owner", expect.any(String));
              expect(review).toHaveProperty(
                "review_img_url",
                expect.any(String)
              );
              expect(review).toHaveProperty("review_body", expect.any(String));
              expect(review).toHaveProperty("category", expect.any(String));
              expect(review).toHaveProperty("created_at", expect.any(String));
              expect(review).toHaveProperty("votes", expect.any(Number));
            });
          });
      });
      test("correct category", () => {
        return request(app)
          .get("/api/reviews/?category=dexterity")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBeGreaterThan(0);
            body.reviews.forEach((review) => {
              expect(review.category).toBe("dexterity");
            });
          });
      });
      test("responds with all reviews if query omitted", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBe(13);
          });
      });
      test("status: 404, category does not exist", () => {
        return request(app)
          .get("/api/reviews/?category=nonexistent")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("category does not exist");
          });
      });
      test("status:404, valid category but no reviews", () => {
        return request(app)
          .get("/api/reviews/?category=children's+games")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("no reviews exists for this category");
          });
      });
    });
    describe("sort_by query", () => {
      test("responds with an array of reviews", () => {
        return request(app)
          .get("/api/reviews/?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.reviews)).toBe(true);
          });
      });
      test("each review object contains the right properties", () => {
        return request(app)
          .get("/api/reviews/?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBeGreaterThan(0);
            body.reviews.forEach((review) => {
              expect(review).toHaveProperty("title", expect.any(String));
              expect(review).toHaveProperty("designer", expect.any(String));
              expect(review).toHaveProperty("owner", expect.any(String));
              expect(review).toHaveProperty(
                "review_img_url",
                expect.any(String)
              );
              expect(review).toHaveProperty("review_body", expect.any(String));
              expect(review).toHaveProperty("category", expect.any(String));
              expect(review).toHaveProperty("created_at", expect.any(String));
              expect(review).toHaveProperty("votes", expect.any(Number));
            });
          });
      });
      test("defaults to created_at", () => {
        return request(app)
          .get("/api/reviews/?sort_by")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("created_at");
          });
      });
      test("sort_by votes", () => {
        return request(app)
          .get("/api/reviews/?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("votes", { descending: true });
          });
      });
      test("status:400, sort_by coloumn which doesn't exist", () => {
        return request(app)
          .get("/api/reviews/?sort_by=cats")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid sort query");
          });
      });
    });
  });
  describe("order query", () => {
    test("responds with an array of reviews", () => {
      return request(app)
        .get("/api/reviews/?sort_by&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.reviews)).toBe(true);
        });
    });
    test("each review object contains the right properties", () => {
      return request(app)
        .get("/api/reviews/?sort_by&order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews.length).toBeGreaterThan(0);
          body.reviews.forEach((review) => {
            expect(review).toHaveProperty("title", expect.any(String));
            expect(review).toHaveProperty("designer", expect.any(String));
            expect(review).toHaveProperty("owner", expect.any(String));
            expect(review).toHaveProperty("review_img_url", expect.any(String));
            expect(review).toHaveProperty("review_body", expect.any(String));
            expect(review).toHaveProperty("category", expect.any(String));
            expect(review).toHaveProperty("created_at", expect.any(String));
            expect(review).toHaveProperty("votes", expect.any(Number));
          });
        });
    });
    test("defaults to desc", () => {
      return request(app)
        .get("/api/reviews/?sort_by=votes&order")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("votes", { descending: true });
        });
    });
    test("asc order", () => {
      return request(app)
        .get("/api/reviews/?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("votes", { ascending: true });
        });
    });
    test("status:400, order not asc or desc", () => {
      return request(app)
        .get("/api/reviews/?sort_by=votes&order=cats")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid order query");
        });
    });
  });
});
