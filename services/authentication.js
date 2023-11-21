require('dotenv').config()
const jwt = require('jsonwebtoken')


function authenticateToken(req, res, next){
    const authHeader = req.headers['autherization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if(err){
            return res.sendStatus(403) //403 - Forbidden Access request
        }
        else{
            res.locals = response
            next()
        }
    })
}

module.exports = {
    authenticateToken:  authenticateToken
    
}