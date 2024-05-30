const db = require('../db/connection.js');

exports.selectCommentsByIdExists = (article_id)=>{
      return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
    .then((data)=>{
       return data.rows
    })
}

