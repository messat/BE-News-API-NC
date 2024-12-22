const db = require('../db/connection.js');
const fs = require('fs/promises')
const {queryArticleId, queryCommentId} = require("./checkExists.model.js")

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



exports.selectAllArticles = async (topic, sort_by, order, arrOfKeysQuery, limit, p)=>{
    if(topic || sort_by || order || limit){
        return checkQueryExists(topic, sort_by, order, arrOfKeysQuery, limit, p)
    } 
    else {
        const {rows: allArticles} = await db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;')
        return allArticles
    }
}


exports.selectCommentsByArticleId =  async (article_id, limit, p)=>{
    let commentQry = 'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC'
    if(!isNaN(limit)){
        commentQry += ` LIMIT ${limit}`
    }
    if(!isNaN(p) && !isNaN(limit)){
        p = (p - 1) * limit
        commentQry += ` OFFSET ${p}`
    }
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
    try {
        const checkCommentId = await queryCommentId(comment_id)
        if(checkCommentId.length){
            await db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
        } else {
            return Promise.reject({status: 404, msg: '404 Route Not Found'})
        } 
    } catch (err) {
        throw err
    }
}

exports.selectAllUsers = async ()=>{
    const {rows: users} = await db.query('SELECT * FROM users');
    return users
}

exports.selectByUserName =  async (username)=>{
    try {
        let sqlString = 'SELECT * FROM users WHERE username = $1;'
        const queryValue = [username]
        const {rows: userDetails} = await db.query(sqlString, queryValue)
        if(!userDetails.length){
             return Promise.reject({status: 404, msg: '404 Route Not Found'})
        } 
        return userDetails
    } catch (err) {
        throw err
    }
}

exports.updateComment = async (comment_id, inc_votes)=>{
   if(comment_id){
    const {rows: commentFilter} = await db.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        if(commentFilter.length){
            if(typeof inc_votes === 'number'){
                const {rows: updateVotes} = await db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [inc_votes, comment_id])
                return updateVotes[0]
            } else {
                return Promise.reject({status: 400, msg: '400 Bad Request'})
            }
        } else {
            return Promise.reject({status: 404, msg: '404 Route Not Found'})
        }
    }
}

exports.addNewArticle = async (author, title, body, topic, article_img_url)=>{
    await db.query(`INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ( $1, $2, $3,$4, $5) RETURNING *`, [title, topic, author, body, article_img_url])
    const { rows: allArticles } = await db.query('SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic,articles.created_at,articles.votes,articles.article_img_url, CAST (COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id')
    const newArticleFinder = allArticles.filter( article => article.body === body)
    return newArticleFinder[0]
}

exports.insertNewTopic = async (slug, description) => {
    try {
        if(typeof(slug) == "string" || typeof(description) == "string"){
            const {rows: newTopic} = await db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`, [slug, description])
            return newTopic[0]
        } 
    } catch (err) {
        throw err
    }
}

exports.deleteSingleArticle = async (article_id) => {
    try {
        const article = await queryArticleId(article_id)
        if(article.length) {
            await db.query(`DELETE FROM Comments WHERE article_id = $1`, [article_id])
            await db.query(`DELETE FROM Articles WHERE article_id = $1`, [article_id])
        } 
    } catch (err) {
        throw(err)
    }
}

