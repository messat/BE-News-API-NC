const db = require('../db/connection.js');
const fs = require('fs/promises')
const {queryArticleId} = require("./checkExists.model.js")

const {checkQueryExists} = require('./checkExists.model.js');

exports.selectAllTopics = async ()=>{
    const {rows} = await db.query('SELECT * FROM topics;');
    return rows;
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
        const {rows: singleArticle } = articleId
        if (!singleArticle.length){
                return Promise.reject({status: 404, msg: "404 Route Not Found"})
            } 
        return singleArticle[0]
 } catch (err) {
    throw err
 }         
}



exports.selectAllArticles = async (topic, sort_by, order, arrOfKeysQuery)=>{
    if(topic || sort_by || order){
        return checkQueryExists(topic, sort_by, order, arrOfKeysQuery)
    } 
    else {
        const {rows: allArticles} = await db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
        return allArticles
    }
    }


exports.selectCommentsByArticleId =  async (article_id)=>{
    let commentQry = 'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC'
    try {
        const checkArticleId = await queryArticleId(article_id)
        if(checkArticleId.length){
            const {rows: commentsById} = await db.query(commentQry, [article_id])
            return commentsById
        } else {
            return Promise.reject({status: 404, msg: '404 Route Not Found'})
        }
    } catch (err){
      throw(err)
    }
}

exports.insertNewComment= async (article_id, username, body)=>{
    try {
        const checkArticleId = await queryArticleId(article_id)
        if(!checkArticleId.length){
            return Promise.reject({status: 404, msg: '404 Route Not Found'})
           } 
        const {rows: commentPost} = await db.query(`INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`, [body, article_id, username])
        return commentPost[0]
    }
    catch (err){
        throw(err)
    }
}

exports.updateVotesByArticleId = async (article_id, inc_votes)=>{
    try {
        const checkArticleId = await queryArticleId(article_id)
        if(checkArticleId.length){
            if(typeof inc_votes === 'number'){
                const {rows: updateArticleVote} = await db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id])
                return updateArticleVote[0]
            } else {
                return Promise.reject({status: 400, msg: '400 Bad Request'})
            }
        }
        else {
            return Promise.reject({status: 404, msg: '404 Route Not Found'})
        }
    } 
    catch (err){
        throw err
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
    const { rows } = await db.query('SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id')
    const postArticle = rows.filter((article)=>{
        if(article.body === body){
           return article;
            }
        })
       return postArticle[0]
}


