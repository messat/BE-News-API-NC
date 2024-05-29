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
});