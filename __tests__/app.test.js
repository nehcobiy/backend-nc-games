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
  describe("/api/categories", () => {
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
          body.forEach((category) => {
            expect(category).toHaveProperty("slug", expect.any(String));
            expect(category).toHaveProperty("description", expect.any(String));
          });
        });
    });
  });
  describe("/api/reviews", () => {
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
  describe("/api/reviews/:review_id", () => {
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
          expect(body.msg).toBe("Bad request: invalid input");
        });
    });
    test("status: 404 not found, valid ID but does not exist", () => {
      return request(app)
        .get("/api/reviews/9999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("input not found");
        });
    });
  });
  describe("/api/reviews/:review_id/comments", () => {
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
          expect(body.msg).toBe("Bad request: invalid input");
        });
    });
    test("status: 404, valid ID but comment does not exist", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("input not found");
        });
    });
  });
});
