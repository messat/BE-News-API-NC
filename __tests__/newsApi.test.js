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
    test('Status 200: GET request responds with all topics contained in an array', () => {
        return request(app)
               .get('/api/topics')
               .expect(200)
               .then(({body})=>{
                const topicsArray = body.topics
                expect(topicsArray).toHaveLength(3)
                topicsArray.forEach((topic)=>{
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description : expect.any(String)
                    })
                }) 
               })
    });
    test('Status 404: GET request with an invalid endpoint', () => {
      return request(app)
             .get('/api/toppic')
             .expect(404)
             .then(({body})=>{
               expect(body.msg).toBe('404 Route Not Found')
             })
            });
    test('Status 404: POST request - incorrect request method', () => {
      return request(app)
              .post('/api/topics')
              .expect(404)
              .then(({body})=>{
                expect(body.msg).toBe('404 Route Not Found')
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
    test('Status 200: GET request when passed with specfic article ID parameteric endpoint', () => {
        return request(app)
               .get('/api/articles/1')
               .expect(200)
               .then(({body})=>{
                const articleObj = body.article
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
               })
    });
    test('Status 404: GET request when passed with parametric endpoint that does not exist for instance, the article ID does not exist', () => {
        return request(app)
               .get('/api/articles/800')
               .expect(404)
               .then(({body})=>{
                expect(body.msg).toBe('404 Not Found')
               })
    });
    test('Status 400: GET request when passed with parametric endpoint that does not match the data type conveys message - bad request', () => {
        return request(app)
               .get('/api/articles/banana')
               .expect(400)
               .then(({body})=>{
                expect(body.msg).toBe('400 Invalid Input')
               })
    });
});

describe('CORE Task 5: GET request /api/articles', () => {
  test('Status 200: GET request fetches all articles in the array and checks if the array by date is in descending order', () => {
    return request(app)
           .get('/api/articles')
           .expect(200)
           .then(({body})=>{
            const articlesArray = body.articles
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
                comment_count: expect.any(Number),
              })
              expect(article).not.toHaveProperty('body')
            })
            expect(articlesArray).toBeSortedBy('created_at',{descending: true})
           })
  });
});

describe('CORE Task 6: GET request /api/articles/:article_id/comments', () => {
  test('Status 200: GET request to fetch all comments from a requested article_id and is ordered by most recent first', () => {
    return request(app)
           .get('/api/articles/1/comments')
           .expect(200)
           .then(({body})=>{
            const commentsIdArray = body.comments
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
           .then(({body})=>{
            const commentsIdArray = body.comments
            expect(commentsIdArray).toEqual([])
           })
  });
  test('Status 404: GET request with an article_id that does not exist in the articles table', () => {
    return request(app)
           .get('/api/articles/800/comments')
           .expect(404)
           .then(({body})=>{
            expect(body.msg).toBe('404 Not Found')
           })
  });
  test('Status 400: GET request with an article_id but does not follow schema validation - incorrect data type - string', () => {
    return request(app)
           .get('/api/articles/not-a-number/comments')
           .expect(400)
           .then(({body})=>{
            expect(body.msg).toBe('400 Invalid Input')
           })
  });
});

describe('CORE Task 7: POST request /api/articles/:article_id/comments', () => {
  test('Status 201: POST request to send body and add the comment to the corresponding article in the database', () => {
   const newUser = {
    username: 'butter_bridge',
    body: 'I wake up in the morning thinking why do I even bother'
   }
    return request(app)
           .post('/api/articles/1/comments')
           .send(newUser)
           .expect(201)
           .then(({body})=>{
            expect(body.comment).toEqual({
              comment_id: 19,
              body: 'I wake up in the morning thinking why do I even bother',
              article_id: 1,
              author: 'butter_bridge',
              votes: 0,
              created_at: expect.any(String)
            })
           })
  });
  test('Status 201: POST request post the comment despite containing extra properties which are ignored', () => {
    const newUser = {
      username: 'butter_bridge',
      body: 'Salaams Cola is the best drink',
      origin: 'Turkey'
    }
     return request(app)
            .post('/api/articles/1/comments')
            .send(newUser)
            .expect(201)
            .then(({body})=>{
             expect(body.comment.author).toBe('butter_bridge')
             expect(body.comment.body).toBe('Salaams Cola is the best drink')
             expect(body.comment).not.toHaveProperty('origin')
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
            .then(({body})=>{
             expect(body.msg).toBe('400 Invalid Input')
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
            .then(({body})=>{
             expect(body).toEqual({status: 404, msg: '404 Not Found'})
            })
   });
   test('Status 400: POST request responds with an error message and status code when username does not exist', () => {
    const newUser = {
     username: 'Muhammad',
     body: 'King of Wall Street'
    }
     return request(app)
            .post('/api/articles/1/comments')
            .send(newUser)
            .expect(400)
            .then(({body})=>{
             expect(body.msg).toBe('400 Invalid Input')
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
            .then(({body})=>{
              const articleIdObj = body.article
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
   test('Status 200: PATCH request deducts the votes by the requested article_id', () => {
    const updateVotes = {
      inc_votes : -81 
    }
     return request(app)
            .patch('/api/articles/1')
            .send(updateVotes)
            .expect(200)
            .then(({body})=>{
              const articleIdObj = body.article
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
            .then(({body})=>{
              expect(body.msg).toBe('404 Not Found')
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
            .then(({body})=>{
              expect(body.msg).toBe('400 Bad Request')
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
            .then(({body})=>{
              expect(body.msg).toBe('400 Bad Request')
            })
   });
   test('Status 400: PATCH request responds with an error message and status code when article_id exist but the object is empty', () => {
    const updateVotes = {}
     return request(app)
            .patch('/api/articles/3')
            .send(updateVotes)
            .expect(400)
            .then(({body})=>{
              expect(body.msg).toBe('400 Bad Request')
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
            .then(({body})=>{
              expect(body.msg).toBe('404 ID does not exist')
            })
    });
    test('Status 400: DELETE request responds with an appropriate status and error message when requested with an invalid data type', () => {
      return request(app)
        .delete('/api/comments/not-a-number')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('400 Invalid Input');
        });
      })
});

describe('CORE Task 10: GET request /api/users', () => {
  test('Status 200: GET request returns all users in the array', () => {
    return request(app)
          .get('/api/users')
          .expect(200)
          .then(({body})=>{
           const usersArray = body.users
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
           .then(({body})=>{
            expect(body.msg).toBe('404 Route Not Found')
           })
  });
})

describe('CORE Task 11: GET request /api/articles?topic=mitch using query strings', () => {
  test('Status 200: GET request with query string of topic searched responding with all the given object(s) in array', () => {
    return request(app)
    .get('/api/articles?topic=mitch')
    .expect(200)
    .then(({body})=>{
      const topicsArr = body.articles
     topicsArr.forEach((topic)=>{
      expect(topic).toHaveProperty('topic', 'mitch')
     })
    })
  });
  test('Status 200: GET request fetches all the articles in the array when the query is omitted', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body})=>{
      const articlesArr = body.articles
     expect(articlesArr).toHaveLength(13)
    })
  });

  test('Status 200: GET request returns an empty array when topic exists in the child table but not in parent table', () => {
    return request(app)
    .get('/api/articles?topic=paper')
    .expect(200)
    .then(({body})=>{
      const articlesArr = body.articles
     expect(articlesArr).toEqual([])
    })
  });
  test('Status 404: GET request with a query string that does not match the searched property and does not exist in the topics table', () => {
    return request(app)
    .get('/api/articles?topic=dogs')
    .expect(404)
    .then(({body})=>{
     expect(body.msg).toBe('404 Not Found')
    })
  });
  
  test('Status 200: GET request with a query that does not match the field property responds with all the articles and ignores the query string', () => {
    return request(app)
    .get('/api/articles?topicss=mitch')
    .expect(200)
    .then(({body})=>{
      const topicsArr = body.articles
      expect(topicsArr).toHaveLength(13)
    })
  });
});

describe('CORE Task 12: GET request /api/articles/:article_id', () => {
  test('Status 200: GET request which responds with an object containing total count of all comments with the requested article_id and adds a property comment_count', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body})=>{
      const articleObj = body.article
      expect(articleObj.article_id).toBe(1)
      expect(articleObj).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
      })
      expect(articleObj).toEqual({
        author: 'butter_bridge',
        title: 'Living in the shadow of a great man',
        article_id: 1,
        topic: 'mitch',
        body: "I find this existence challenging",
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        comment_count: 11
      })
    })
  })
 })
 

 describe('ADAVNCED Task 15: GET  request /api/articles', () => {
     test('Status 200: GET request using query to sort_by the articles', () => {
      return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body})=>{
            const articlesArr = body.articles
            expect(articlesArr).toBeSortedBy('author', {
              descending: true
            })
    })
     });
     test('Status 200: GET request using two queries to sort_by & order the articles', () => {
      return request(app)
            .get('/api/articles?sort_by=title&order=asc')
            .expect(200)
            .then(({body})=>{
            const articlesArr = body.articles
            expect(articlesArr).toBeSortedBy('title', {
              ascending: true
            })
    })
     });
     test('Status 200: GET request using only the order to ascend the articles by the default created_at property', () => {
      return request(app)
            .get('/api/articles?order=ASC')
            .expect(200)
            .then(({body})=>{
            const articlesArr = body.articles
            expect(articlesArr).toBeSortedBy('created_at', {
              ascending: true
            })
    })
     });
     test('Status 200: GET request using three queries', () => {
      return request(app)
            .get('/api/articles?order=ASC&sort_by=body&topic=mitch')
            .expect(200)
            .then(({body})=>{
            const articlesArr = body.articles
            expect(articlesArr).toBeSortedBy('body', {
              ascending: true
            })
    })
     });
     test('Status 404: GET request with one valid query and the other invalid i.e. topic returns an error message', () => {
      return request(app)
            .get('/api/articles?order=ASC&topic=mites')
            .expect(404)
            .then(({body})=>{
            expect(body.msg).toBe('404 Not Found')
    })
     });
    
     test('Status 400: GET request with invalid sort_by query', () => {
      return request(app)
            .get('/api/articles?sort_by=apples')
            .expect(400)
            .then(({body})=>{
            expect(body.msg).toBe('400 Bad Request')
    })
     });
 });

 
 describe('ADAVNCED Task 17: GET  request /api/users/:username', () => {
     test('Status 200: GET request the user information when entered by username', () => {
      return request(app)
      .get('/api/users/icellusedkars')
      .expect(200)
      .then(({body})=>{
      const userArr =body.user
      expect(userArr).toHaveLength(1)
      userArr.forEach((user)=>{
        expect(user).toMatchObject({
          username: expect.any(String),
          avatar_url: expect.any(String),
          name: expect.any(String)
        })
      })
})
     });
     test('Status 404: GET request - the user is not found', () => {
      return request(app)
      .get('/api/users/Muhammad')
      .expect(404)
      .then(({body})=>{
      expect(body.msg).toBe('404 Not Found')
      })
     });
 });

 describe('ADAVNCED Task 18: PATCH request /api/comments/:comment_id', () => {
     test('Status 200: PATCH request updates the vote count by the given body request', () => {
      const addVotes = { inc_votes: 5 }
      return request(app)
      .patch('/api/comments/3')
      .send(addVotes)
      .expect(200)
      .then(({body})=>{
        expect(body.comment.votes).toBe(105)
      })
     });
     test('Status 200: PATCH request deducts the votes', () => {
      const deductsVotes = { inc_votes: -400 }
      return request(app)
      .patch('/api/comments/3')
      .send(deductsVotes)
      .expect(200)
      .then(({body})=>{
        expect(body.comment.votes).toBe(-300)
      })
     });
     test('Status 400: PATCH request does not follow the schema validation - string', () => {
      const addVotes = { inc_votes: 'hello' }
      return request(app)
      .patch('/api/comments/3')
      .send(addVotes)
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('400 Bad Request')
      })
     });
     test('Status 404: PATCH request comment_id does not exist', () => {
      const addVotes = { inc_votes: 1 }
      return request(app)
      .patch('/api/comments/700')
      .send(addVotes)
      .expect(404)
      .then(({body})=>{
        expect(body.msg).toBe('404 Not Found')
      })
     });
 });


 describe('ADVANCED Task 19: POST request /api/articles', () => {
  test('Status 201: POST request to add new article', () => {
    const newArticle = {
      author: 'lurker',
      title: 'Wolf of Apple',
      body: 'If there is iota of goodness, then act up on it', 
      topic: 'paper',
      article_img_url: 'https://www.tradingview.com/symbols/NASDAQ-AAPL/'
    }
     return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({body})=>{
            const articleIdObj = body.article
             expect(articleIdObj).toMatchObject({
              article_id: 14,
              title: 'Wolf of Apple',
              topic: 'paper',
              author: 'lurker',
              body: 'If there is iota of goodness, then act up on it',
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: 'https://www.tradingview.com/symbols/NASDAQ-AAPL/',
              comment_count: expect.any(Number)
            })
            })
   });
   test('Status 201: POST request to post an article when the user has not provided an image URL which has default value', () => {
    const newArticle = {
      author: 'lurker',
      title: 'The economic crash',
      body: 'The world did not see this one coming', 
      topic: 'paper',
    }
    return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(201)
            .then(({body})=>{
            const articleIdObj = body.article
             expect(articleIdObj).toMatchObject({
              article_id: 14,
              title: 'The economic crash',
              topic: 'paper',
              author: 'lurker',
              body: 'The world did not see this one coming',
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: 'https://www.techpowerup.com/img/LKhb6Bdk2RzjfBlV.jpg',
              comment_count: expect.any(Number)
            })
            })

   });
   test('Status 400: POST request displays an error message and status code when the body does not fulfill the criteria of articles table', () => {
    const newArticle = {
      title: 'Wolf of Apple',
      body: 'If there is iota of goodness, then act up on it', 
      topic: 'paper',
    }
     return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({body})=>{
             expect(body.msg).toBe('400 Invalid Input')
            })
   });
   test('Status 400: POST request responds with an error message and status code when author violates the key constraint', () => {
    const newArticle = {
      author: 'Muhammad',
      title: 'Wolf of Apple',
      body: 'If there is iota of goodness, then act up on it', 
      topic: 'paper',
      article_img_url: 'https://www.tradingview.com/symbols/NASDAQ-AAPL/' 
    }
     return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({body})=>{
            expect(body.msg).toBe('400 Invalid Input')
            })
   });
   test('Status 400: POST request responds with an error message and status code when passed an empty object', () => {
    const newArticle = {}
     return request(app)
            .post('/api/articles')
            .send(newArticle)
            .expect(400)
            .then(({body})=>{
             expect(body.msg).toBe('400 Invalid Input')
            })
   });
  });


 
