const db  = require('../db/connection')

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