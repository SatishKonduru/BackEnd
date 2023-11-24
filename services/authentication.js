require('dotenv').config()
const jwt = require('jsonwebtoken')


function authenticateToken(req, res, next){
    console.log("Request Data in Authentication process: ", req.headers)
    const authHeader = req.headers['authorization']
    console.log("authHeader: ", authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    console.log("Token: ", token)
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