const db = require('../db/connection.js');


exports.checkQueryExists = async (topic, sort_by = 'created_at', order = 'DESC', arrOfKeysQuery, limit = 10, p)=>{
   try {
      const orderKeywords = ['asc', 'desc', 'DESC', 'ASC']
      const {rows: fieldNames} = await db.query(`Select * FROM articles`)
      const fieldProperties = Object.keys(fieldNames[0])
      let sqlString = 'SELECT * FROM articles'
      const queryValues = []
      let countQuery = 'SELECT COUNT(*) AS total_count FROM articles'
      if (arrOfKeysQuery.includes('topic') || topic){
            const { rows:checkTopic } = await db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            if(!checkTopic.length){
               return Promise.reject({status: 404, msg: '404 Route Not Found'})
            } 
            queryValues.push(topic)
            sqlString+=' WHERE topic = $1'
      }

      if(arrOfKeysQuery.includes('sort_by') || sort_by){
         if(!fieldProperties.includes(sort_by)){
            return Promise.reject({status: 400, msg: '400 Bad Request'})
         }
            sqlString+=` ORDER BY ${sort_by}`
      }

      if(arrOfKeysQuery.includes('order') || order){
         if(!orderKeywords.includes(order)){
            return Promise.reject({status: 400, msg: '400 Bad Request'})
         }
         sqlString+= ` ${order}`
      } 

      if(isNaN(limit) || parseInt(limit) < 1){
         return Promise.reject({status: 400, msg: '400 Bad Request'})
      }
      sqlString+=` LIMIT ${limit}`

      if(p){
         if(isNaN(p) || parseInt(p) < 1) {
            return Promise.reject({status: 400, msg: '400 Bad Request'})
         }
         p = (p - 1) * (limit)
         sqlString+=` OFFSET ${p}`
      }
      sqlString+=';'
      const {rows: paginatedArticles} = await db.query(sqlString, queryValues)
      return paginatedArticles 
   } catch (err) {
      throw err
   }
}

exports.queryArticleId = async (article_id) => {
   try {
      const {rows: checkArticleId} = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      if(!checkArticleId.length){
         return Promise.reject({status: 404, msg: "404 Route Not Found"})
      }
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


