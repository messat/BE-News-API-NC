const db = require('../db/connection.js');
const fs = require('fs/promises')
const format = require('pg-format');

const {selectCommentsByIdExists} = require('./checkExists.model.js');
const { response } = require('../app.js');
exports.selectAllTopics = ()=>{
    return db.query('SELECT * FROM topics;')
    .then((data)=>{
        return data.rows
    })
}

exports.selectAllEndpoints = ()=>{
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((data)=>{
        return JSON.parse(data)
    })
}

exports.selectArticleById = (article_id)=>{
        return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.body,articles.votes,articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [article_id])
        .then((response)=>{
            const articleIdArray = response.rows
            if (!articleIdArray.length){
            return Promise.reject({status: 404, msg: '404 Not Found'})
             } 
            return response.rows[0]
   })
}

exports.selectAllArticles = (topic)=>{
    if(topic){
        let sqlString = `SELECT * FROM articles WHERE topic = $1;`
        return db.query(sqlString, [topic])
        .then((data)=>{
            if(!data.rows.length){
                return Promise.reject({status: 404, msg: '404 Not Found'})
            }
            return data.rows
        })
    }
    else {
        return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
        .then((data)=>{
            return data.rows
        })
    }
}

exports.selectCommentsByArticleId =  (article_id)=>{
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((data)=>{
        const commentsByArticleId = data.rows
        if(commentsByArticleId.length){
          return selectCommentsByIdExists(article_id)
        }
        else {
            return Promise.reject({status: 404, msg: '404 Not Found'})
        }
    })
}

exports.insertNewComment= (article_id, newComment)=>{
     return db.query('SELECT * FROM comments WHERE article_id = $1', [article_id])
    .then((data)=>{
        const filterByArticleId = data.rows
        if(!filterByArticleId.length){
            return Promise.reject({status: 404, msg: '404 Not Found'})
           } 
        else if(filterByArticleId.length){
           if(newComment.username){
            return db.query('SELECT * FROM users WHERE username = $1', [newComment.username])
           } else {
            return Promise.reject({status: 400, msg: '400 Bad Request'})
           }
        }
    })
    .then((response)=>{
      const filterUserName = response.rows
      if(!filterUserName.length){
        return Promise.reject({status: 401, msg: '401 Not Authenticated'})
      } else if(filterUserName.length){
          const nestedArr = [[newComment.body,article_id, newComment.username]]
            return db.query(format(`INSERT INTO comments (body, article_id, author) VALUES %L RETURNING *`, nestedArr))
      }
    })
    .then((data)=>{
        return data.rows[0]
    })   
}

exports.updateVotesByArticleId = (article_id, newVotes)=>{
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then((data)=>{
        const filterArticleById = data.rows.length
        if(filterArticleById){
            if(typeof newVotes.inc_votes === 'number'){
                return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [newVotes.inc_votes, article_id])
            } else {
                return Promise.reject({status: 400, msg: '400 Bad Request'})
            }
        } else {
            return Promise.reject({status: 404, msg: '404 Not Found'})
        }
    })
    .then((response)=>{
        return response.rows[0]
    })
}

exports.deleteCommentById =(comment_id)=>{
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((data)=>{
        const filterCommentsById = data.rows
        if(filterCommentsById.length){
           
            return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
        } else {
            return Promise.reject({status: 404, msg: '404 ID does not exist'})
        }
    })
}

exports.selectAllUsers = ()=>{
    return db.query('SELECT * FROM users')
    .then((data)=>{
        return data.rows
    })
}