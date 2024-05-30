const db = require('../db/connection')
const request = require('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')
const endpointJson = require('../endpoints.json')

beforeEach(()=>{
    return seed(data)
  })

afterAll(() => db.end())

describe('Core Task 2: GET /api/topics', () => {
    test('Status 200: GET request to respond with all topics at endpoint /api/topics', () => {
        return request(app)
               .get('/api/topics')
               .expect(200)
               .then((res)=>{
                const topicsArray = res.body.topics
                expect(topicsArray).toHaveLength(3)
                topicsArray.forEach((topic)=>{
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description : expect.any(String)
                    })
                }) 
                expect(topicsArray).toEqual([
                    {
                      description: 'The man, the Mitch, the legend',
                      slug: 'mitch'
                    },
                    {
                      description: 'Not dogs',
                      slug: 'cats'
                    },
                    {
                      description: 'what books are made of',
                      slug: 'paper'
                    }
                  ])
               })
    });
});

describe('Core Task 2: GET /api/topics handling endpoint errors', () => {
    test('Status 404: GET request with an invalid endpoint', () => {
        return request(app)
               .get('/api/toppic')
               .expect(404)
               .then((res)=>{
                 expect(res.body.msg).toBe('404 Route Not Found')
               })
    });
    test('Status 404: POST request with an invalid endpoint and http request method', () => {
        return request(app)
               .post('/api/apple')
               .expect(404)
               .then((res)=>{
                 expect(res.body.msg).toBe('404 Route Not Found')
               })
    });
});

describe('Core Task 3: GET request /api', () => {
    test('Status 200: An object describing all the available endpoints on this API', () => {
        return request(app)
               .get('/api')
               .expect(200)
               .then(({body})=>{
                const endpointInformation = body.endpoints
                  expect(endpointInformation).toEqual(endpointJson)
               })
    });
});

describe('CORE Task 4: GET request /api/articles/:article_id', () => {
    test('Status 200: GET request when passed with parameter fetches the article by Id', () => {
        return request(app)
               .get('/api/articles/1')
               .expect(200)
               .then((res)=>{
                const articleObj = res.body.article
                expect(articleObj.article_id).toBe(1)
                expect(articleObj).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
                })
                expect(articleObj).toEqual({
                  article_id: 1,
                  title: 'Living in the shadow of a great man',
                  topic: 'mitch',
                  author: 'butter_bridge',
                  body: 'I find this existence challenging',
                  created_at: '2020-07-09T20:11:00.000Z',
                  votes: 100,
                  article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
               })
    });
    test('Status 404: GET request when passed with parameter fetches returns a message with ID not found', () => {
        return request(app)
               .get('/api/articles/800')
               .expect(404)
               .then((res)=>{
                expect(res.body.msg).toBe('404 Not Found')
               })
    });
    test('Status 400: GET request when passed with parametric endpoint that does not match the data type conveys message - bad request', () => {
        return request(app)
               .get('/api/articles/banana')
               .expect(400)
               .then((res)=>{
                expect(res.body.msg).toBe('400 Invalid Input')
               })
    });
});

describe('CORE Task 5: GET request /api/articles', () => {
  test('Status 200: GET request fetches all articles in the array and checks if the array by date is in descending order', () => {
    return request(app)
           .get('/api/articles')
           .expect(200)
           .then((res)=>{
            const articlesArray = res.body.articles
            expect(articlesArray).toHaveLength(13)
            articlesArray.forEach((article)=>{
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
              expect(article).not.toHaveProperty('body')
            })
            expect(articlesArray).toBeSortedBy('created_at',{descending: true})
           })
  });
  test('Status 404: GET request with an endpoint /api/arthicles misspelt results in error message', () => {
    return request(app)
           .get('/api/arthicles')
           .expect(404)
           .then((res)=>{
            expect(res.body.msg).toBe('404 Route Not Found')
           })
  });
});

describe('CORE Task 6: GET request /api/articles/:article_id/comments', () => {
  test('Status 200: GET request to fetch all comments from a requested article_id and is ordered by most recent first', () => {
    return request(app)
           .get('/api/articles/1/comments')
           .expect(200)
           .then((res)=>{
            const commentsIdArray = res.body.comments
            expect(commentsIdArray).toHaveLength(11)
            commentsIdArray.forEach((comment)=>{
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            })
            expect(commentsIdArray).toBeSortedBy('created_at', {descending: true})
           })
  });
  test('Status 200: GET request with an article_id that does not exist in the comments table but exist in articles id - foreign key - returns an empty array', () => {
    return request(app)
           .get('/api/articles/2/comments')
           .expect(200)
           .then((res)=>{
            const commentsIdArray = res.body.comments
            expect(commentsIdArray).toEqual([])
           })
  });
  test('Status 404: GET request with an article_id that does not exist in the comments table and does not exist in the articles table', () => {
    return request(app)
           .get('/api/articles/800/comments')
           .expect(404)
           .then((res)=>{
            expect(res.body.msg).toBe('404 Not Found')
           })
  });
  test('Status 400: GET request with an article_id but does not follow schema validation - incorrect data type - string', () => {
    return request(app)
           .get('/api/articles/not-a-number/comments')
           .expect(400)
           .then((res)=>{
            expect(res.body.msg).toBe('400 Invalid Input')
           })
  });
});

describe('CORE Task 7: POST request /api/articles/:article_id/comments', () => {
  test('Status 201: POST request to send body and add the comment article in the database governed by the article_id requested', () => {
   const newUser = {
    username: 'butter_bridge',
    body: 'I wake up in the morning thinking why do I even bother'
   }
    return request(app)
           .post('/api/articles/1/comments')
           .send(newUser)
           .expect(201)
           .then((res)=>{
            expect(res.body.comment.author).toBe('butter_bridge')
            expect(res.body.comment.body).toBe('I wake up in the morning thinking why do I even bother')
            expect(res.body.comment).toEqual({
              comment_id: 19,
              body: 'I wake up in the morning thinking why do I even bother',
              article_id: 1,
              author: 'butter_bridge',
              votes: 0,
              created_at: expect.any(String)
            })
           })
  });
  test('Status 400: POST request displays an error message and status code when the body does not have username', () => {
    const newUser = {
    body: 'Nice English Tea'
    }
     return request(app)
            .post('/api/articles/1/comments')
            .send(newUser)
            .expect(400)
            .then((res)=>{
             expect(res.body.msg).toBe('400 Bad Request')
            })
   });
   test('Status 404: POST request responds with an error message and status code when article_id does not exist', () => {
    const newUser = {
    username: 'butter_bridge',
     body: 'I love toasts only in the morning'
    }
     return request(app)
            .post('/api/articles/800/comments')
            .send(newUser)
            .expect(404)
            .then((res)=>{
             expect(res.body).toEqual({status: 404, msg: '404 Not Found'})
            })
   });
   test('Status 401: POST request responds with an error message and status code when username does not exist', () => {
    const newUser = {
      username: 'Muhammad',
     body: 'King of Wall Street'
    }
     return request(app)
            .post('/api/articles/1/comments')
            .send(newUser)
            .expect(401)
            .then((res)=>{
             expect(res.body.msg).toBe('401 Not Authenticated')
            })
   });
});

describe('CORE Task 8: PATCH request /api/articles/:article_id', () => {
  test('Status 200: PATCH request updates the votes field by the requested article_id', () => {
    const updateVotes = {
      inc_votes : 1 
    }
     return request(app)
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res)=>{
              const articleIdObj = res.body.article
             expect(articleIdObj).toEqual({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 101,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
            })
   });
   test('Status 200: PATCH request updates the votes is deducted by the requested article_id', () => {
    const updateVotes = {
      inc_votes : -81 
    }
     return request(app)
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then((res)=>{
              const articleIdObj = res.body.article
             expect(articleIdObj).toEqual({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 19,
              article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            })
            })
   });
   test('Status 404: PATCH request responds with an error message and status code when article_id does not exist', () => {
    const updateVotes = {
      inc_votes : 1 
    }
     return request(app)
            .patch('/api/articles/1500')
            .send(updateVotes)
            .expect(404)
            .then((res)=>{
              expect(res.body.msg).toBe('404 Not Found')
            })
   });
   test('Status 400: PATCH request responds with an error message and status code when article_id exist but the object updates votes does not have the correct data type', () => {
    const updateVotes = {
      inc_votes : 'one'
    }
     return request(app)
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(400)
            .then((res)=>{
              expect(res.body.msg).toBe('400 Bad Request')
            })
   });
   test('Status 400: PATCH request responds with an error message and status code when article_id exist but the object does not follow schema validation', () => {
    const updateVotes = {
      countVotes : 1
    }
     return request(app)
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(400)
            .then((res)=>{
              expect(res.body.msg).toBe('400 Bad Request')
            })
   });
   test('Status 400: PATCH request responds with an error message and status code when article_id exist but the object is empty', () => {
    const updateVotes = {}
     return request(app)
            .patch('/api/articles/3')
            .send(updateVotes)
            .expect(400)
            .then((res)=>{
              expect(res.body.msg).toBe('400 Bad Request')
            })
   });
  });

describe('CORE Task 9: DELETE request /api/comments/:comment_id', () => {
    test('Status 204: DELETE request to delete the comment by given comment_id and sends no body back', () => {
      return request(app)
            .delete('/api/comments/1')
            .expect(204)
    });
    test('Status 404: DELETE request responds with an appropriate status and error message when given a non-existent id', () => {
      return request(app)
            .delete('/api/comments/786')
            .expect(404)
            .then((res)=>{
              expect(res.body.msg).toBe('404 ID does not exist')
            })
    });
    test('Status 400: DELETE request responds with an appropriate status and error message when given an invalid id', () => {
      return request(app)
        .delete('/api/comments/not-a-number')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('400 Invalid Input');
        });
      })
});

describe('CORE Task 10: GET request /api/users', () => {
  test('Status 200: GET request returns all users in the array', () => {
    return request(app)
          .get('/api/users')
          .expect(200)
          .then((res)=>{
           const usersArray = res.body.users
           expect(usersArray).toHaveLength(4)
           usersArray.forEach((user)=>{
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
           })
          })
  });
  test('Status 404: GET request with an endpoint /api/user misspelt results in error message', () => {
    return request(app)
           .get('/api/user')
           .expect(404)
           .then((res)=>{
            expect(res.body.msg).toBe('404 Route Not Found')
           })
  });
})