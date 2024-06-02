const db = require('../db/connection.js');
const topics = require('../db/data/test-data/topics.js');

exports.selectCommentsByIdExists = (article_id)=>{
      return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
    .then((data)=>{
       return data.rows
    })
}

exports.checkQueryExists = (topic, sort_by = 'created_at', order = 'DESC')=>{
   const sortByKeywords = ['title', 'author', 'created_at', 'article_id', 'topic', 'body', 'votes', 'article_img_url', 'comment_count']
      const orderKeywords = ['asc', 'desc', 'DESC', 'ASC']
      const topics = ['mitch', 'cats']
      let sqlString = 'SELECT * FROM articles'
      const queryValues = []
      if(topic){
            if(topics.includes(topic)){

               queryValues.push(topic)
               sqlString+=' WHERE topic = $1'
            }
            else if(!topics.includes(topic)){
               return Promise.reject({status: 404, msg: '404 Not Found'})
            }
         }
      if(sortByKeywords.includes(sort_by)){
        sqlString+=` ORDER BY ${sort_by}`
      } else if(!sortByKeywords.includes(sort_by)){
         return Promise.reject({status: 400, msg: '400 Bad Request'})
      }
      if(orderKeywords.includes(order)){
         sqlString+= ` ${order}`
      } else if(!orderKeywords.includes(order)){
         return Promise.reject({status: 400, msg: '400 Bad Request'})
      }
      sqlString+=';'
       return db.query(sqlString, queryValues)
        .then((data)=>{
            if(!data.rows.length){
                return Promise.reject({status: 404, msg: '404 Not Found'})
            }
            return data.rows
        })

      }
