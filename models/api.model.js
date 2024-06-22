const db = require('../db/connection.js');
const fs = require('fs/promises')
//const format = require('pg-format');

const {selectCommentsByIdExists, checkQueryExists} = require('./checkExists.model.js');
const { log } = require('console');



exports.selectAllTopics = async ()=>{
    const data = await db.query('SELECT * FROM topics;');
    return data.rows;
}

exports.selectAllEndpoints = async ()=>{
    const jsonFile = await fs.readFile('./endpoints.json', 'utf-8')
            return JSON.parse(jsonFile)
}

exports.selectArticleById = async (article_id)=>{
 try {
    const articleId = await db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.body,articles.votes,articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1 
        GROUP BY articles.article_id;`, [article_id])
        const articleIdArray = articleId.rows
        if (!articleIdArray.length){
                return Promise.reject({status: 404, msg: '404 Not Found'})
            } 
         return articleIdArray[0]
 } catch (err) {
    throw err
 }
            
}

exports.selectAllArticles = async (topic, sort_by, order, arrOfKeysQuery)=>{
     if(topic || sort_by || order){
        return checkQueryExists(topic, sort_by, order, arrOfKeysQuery)
     } 
        else {
         const allArticles = await db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
        return allArticles.rows
     }
    }


exports.selectCommentsByArticleId =  async (article_id)=>{
    try {
        const checkArticleId = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        if(checkArticleId.rows.length){
            const commentsById = await db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
            return commentsById.rows
        } else {
            return Promise.reject({status: 404, msg: '404 Not Found'})
        }
    } catch (err){
      throw(err)
    }
}

exports.insertNewComment= async (article_id, username, body)=>{
    try {
        const checkArticleId = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        const articleId = checkArticleId.rows
        if(!articleId.length){
            return Promise.reject({status: 404, msg: '404 Not Found'})
           } 
        const commentPost = await db.query(`INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`, [body, article_id, username])
        return commentPost.rows[0]
    }
    catch (err){
     throw(err)
    }
}

exports.updateVotesByArticleId = async (article_id, inc_votes)=>{
        const checkArticleId = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        const filterArticleById = checkArticleId.rows.length
        if(filterArticleById){
            if(typeof inc_votes === 'number'){
                const updateArticleVote = await db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
                return updateArticleVote.rows[0]
            } 
            else {
                return Promise.reject({status: 400, msg: '400 Bad Request'})
            }
    }       
            else {
                return Promise.reject({status: 404, msg: '404 Not Found'
                })
                }
}
    


exports.deleteCommentById = async (comment_id)=>{
        const checkCommentId = await db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
        const filterCommentsById = checkCommentId.rows
        if(filterCommentsById.length){
         await db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
        } else {
            return Promise.reject({status: 404, msg: '404 ID does not exist'})
        }
}

exports.selectAllUsers = async ()=>{
    const data = await db.query('SELECT * FROM users');
    return data.rows;
}

exports.selectByUserName =  async (username)=>{
   let sqlString = 'SELECT * FROM users WHERE username = $1;'
   const queryValue = [username]
   const {rows} = await db.query(sqlString, queryValue)
    if(!rows.length){
        return Promise.reject({status: 404, msg: '404 Not Found'})
    } 
    return rows
}

exports.updateComment = async (comment_id, inc_votes)=>{
   if(comment_id){
    const {rows} = await db.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        const filterCommentById = rows.length
        if(filterCommentById){
            if(typeof inc_votes === 'number'){
                const updateVotes = await db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [inc_votes, comment_id])
                return updateVotes.rows[0]
            } else {
                return Promise.reject({status: 400, msg: '400 Bad Request'})
            }
        } else {
            return Promise.reject({status: 404, msg: '404 Not Found'})
        }
}
}

exports.addNewArticle = async (author, title, body, topic, article_img_url)=>{
    const insertPost = await db.query(`INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ( $1, $2, $3,$4, $5) RETURNING *`, [title, topic, author, body, article_img_url])
    const articles = await db.query('SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id')
    const postArticle = articles.rows.filter((article)=>{
        if(article.body === body){
           return article;
            }
        })
       return postArticle[0]
}


