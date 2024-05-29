const db = require('../db/connection.js');
const fs = require('fs/promises')
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

   return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
   .then((data)=>{
    if (data.rows.length === 0){
        return Promise.reject({status: 404, msg: '404 Not Found'})
    }
    return data.rows[0]
   })

}