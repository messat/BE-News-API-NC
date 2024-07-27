const db = require('../db/connection.js');


exports.checkQueryExists = async (topic, sort_by = 'created_at', order= 'DESC', arrOfKeysQuery, limit = 10, p, allArticleLength)=>{
      const orderKeywords = ['asc', 'desc', 'DESC', 'ASC']
      const fieldNames = await db.query(`Select * FROM articles`)
      const sortByKeywords = Object.keys(fieldNames.rows[0])

      let sqlString = 'SELECT * FROM articles'
      const queryValues = []
      if (arrOfKeysQuery.includes('topic') || arrOfKeysQuery.includes('sort_by') || arrOfKeysQuery.includes('order') || arrOfKeysQuery.includes('limit')){
         if(topic){
            const checkTopic = await db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            if(checkTopic.rows.length){
               queryValues.push(topic)
               sqlString+=' WHERE topic = $1'
            } 
            else { 
                   return Promise.reject({status: 404, msg: '404 Not Found'})
            }
         } 
         if(sort_by){
            sqlString+=` ORDER BY ${sort_by}`
         } 
         if(!sortByKeywords.includes(sort_by)){
            return {status: 400, msg: '400 Bad Request'}
         }
         if(order){
            sqlString+= ` ${order}`
         } 
         if(!orderKeywords.includes(order)){
            return {status: 400, msg: '400 Bad Request'}
         }
         if(limit){
            sqlString+= ` LIMIT ${limit}`
         }
         if(p){
            sqlString+= ` OFFSET ${p}`
         }
         sqlString+=';'
         const {rows} = await db.query(sqlString, queryValues)
            return rows 
      } 
      }
