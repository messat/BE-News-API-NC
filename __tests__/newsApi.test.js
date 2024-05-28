const db = require('../db/connection')
const request = require('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index')

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
    test('Status 404: GET request with an invalid endpoint', () => {
        return request(app)
               .get('/api/toppic')
               .expect(404)
               .then((res)=>{
                 expect(res.body.msg).toBe('404 Not Found')
               })
    });
});

