const db = require('../db/connection.js');


exports.checkQueryExists = async (topic, sort_by = 'created_at', order= 'DESC', arrOfKeysQuery)=>{
      const orderKeywords = ['asc', 'desc', 'DESC', 'ASC']
      const {rows: fieldNames} = await db.query(`Select * FROM articles`)
      const fieldProperties = Object.keys(fieldNames[0])
      let sqlString = 'SELECT * FROM articles'
      const queryValues = []
      if (arrOfKeysQuery.includes('topic') || arrOfKeysQuery.includes('sort_by') || arrOfKeysQuery.includes('order')){
         if(topic){
            const { rows:checkTopic } = await db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            if(checkTopic.length){
               queryValues.push(topic)
               sqlString+=' WHERE topic = $1'
            } 
            else { 
               return Promise.reject({status: 404, msg: '404 Route Not Found'})
            }
         } 
         if(sort_by){
            sqlString+=` ORDER BY ${sort_by}`
         } 
         if(!fieldProperties.includes(sort_by)){
            return {status: 400, msg: '400 Bad Request'}
         }
         if(order){
            sqlString+= ` ${order}`
         } 
         if(!orderKeywords.includes(order)){
            return {status: 400, msg: '400 Bad Request'}
         }
         sqlString+=';'
         const {rows: articleQuery} = await db.query(sqlString, queryValues)
         return articleQuery 
      } 
      }

exports.queryArticleId = async (article_id) => {
   try {
      const {rows: checkArticleId} = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      return checkArticleId
   }
   catch (err){
      throw err
   }
}

exports.queryCommentId = async (comment_id) => {
   try {
      const {rows: checkCommentId} = await db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
      return checkCommentId
   } catch (err) {
      throw err
   }
}


