exports.endpoints = {
  "GET /api": {
    description:
      "serves up a json representation of all the available endpoints of the api",
  },
  "GET /api/categories": {
    description: "serves an object containing array of all categories",
    queries: [],
    exampleResponse: {
      categories: [
        {
          description: "Players attempt to uncover each other's hidden role",
          slug: "Social deduction",
        },
      ],
    },
  },
  "GET /api/reviews": {
    description: "serves an object containing array of all reviews",
    queries: ["category", "sort_by", "order"],
    exampleResponse: {
      reviews: [
        {
          title: "One Night Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "happyamy2016",
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          category: "hidden-roles",
          created_at: 1610964101251,
          votes: 5,
        },
      ],
    },
  },

  "GET /api/reviews/:review_id": {
    description:
      "serves an object containing review object of that specific review id ",
    exampleResponse: {
      review: {
        review_id: 13,
        title: "Kerplunk; Don't lose your marbles",
        review_body:
          "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
        designer: "Avery Wunzboogerz",
        review_img_url:
          "https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?w=700&h=700",
        votes: 8,
        category: "dexterity",
        owner: "tickle122",
        created_at: "2021-01-25T11:16:54.963Z",
      },
    },
  },

  "GET /api/reviews/:review_id/comments": {
    description:
      "serves an object containing array of all comments for review of specificed review_id",
    exampleResponse: {
      comments: [
        {
          comment_id: 69,
          votes: 0,
          created_at: "2023-02-09T12:23:15.350Z",
          author: "tickle122",
          body: "im a builder this game is lit",
          review_id: 2,
        },
        {
          comment_id: 10,
          votes: 9,
          created_at: "2021-03-27T14:15:31.110Z",
          author: "grumpy19",
          body: "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
          review_id: 2,
        },
        {
          comment_id: 1,
          votes: 16,
          created_at: "2017-11-22T12:36:03.389Z",
          author: "happyamy2016",
          body: "I loved this game too!",
          review_id: 2,
        },
        {
          comment_id: 4,
          votes: 16,
          created_at: "2017-11-22T12:36:03.389Z",
          author: "tickle122",
          body: "EPIC board game!",
          review_id: 2,
        },
      ],
    },
  },

  "POST /api/reviews/:review_id/comments": {
    description: "posts a comment to review of specified review_id",
    exampleRequest: {
      username: "example username",
      body: "example body",
    },
    exampleResponse: {
      comment_id: 100,
      created_at: "2023-02-09T12:23:15.350Z",
      author: "example username",
      body: "example body",
      review_id: 2,
    },
  },

  "PATCH /api/reviews/:review_id": {
    description: "updates vote count on review of specified review_id",
    exampleRequest: {
      inc_votes: 1,
    },
    exampleResponse: {
      review: {
        review_id: 13,
        title: "Kerplunk; Don't lose your marbles",
        review_body:
          "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
        designer: "Avery Wunzboogerz",
        review_img_url:
          "https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?w=700&h=700",
        votes: 9,
        category: "dexterity",
        owner: "tickle122",
        created_at: "2021-01-25T11:16:54.963Z",
      },
    },
  },

  "GET /api/users": {
    description: "serves an object containing array of all users",
    exampleResponse: {
      users: [
        {
          username: "user1",
          name: "Ashton Smith",
          avatar_url: "https://test/images/notreal?cb=20180127221953",
        },
        {
          username: "user2",
          name: "Rosie Chow",
          avatar_url: "https://test/images/alsonotreal?cb=20180127221953",
        },
      ],
    },
  },

  "DELETE /api/comments/:comment_id": {
    description: "deletes comment of specified comment_id ",
    exampleRequest: {
      comment_id: 200,
    },
  },
};
