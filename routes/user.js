const express = require('express')
const nodeMailer = require('nodemailer')
const connection = require('../connection')
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()


router.post('/signup',(req, res)=>{
    let user = req.body
    query ='select email from user where email=?'
    connection.query(query, [user.email], (err, results)=>{
        if(!err){
            if(results.length <=0 ){
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query,[user.username, user.cnumber, user.email, user.password], (err, results)=>{
                    if(!err){
                        res.status(200).json({message: 'Registered Succcessfully.'})
                    }
                    else{
                        return res.status(500).json(err)
                    }
                } )

            }
            else{
                return res.status(400).json({message: 'Email is already Exist.'})  
              }
        }
        else{
          return res.status(500).json(err)  
        }
    })
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body
    query = "select email, password from user where email=?"
    connection.query(query, [user.email], (err, results)=>{
        if(!err){
            if(results.length <= 0){
                return res.status(200).json({message: 'Password is sent to your email.'})
            }
            else{
              var mailOptions = {
                from: process.env.EMAIL,
                to: results[0].email,
                subject: 'Password sent by RSK MART',
                html: '<p><b>Login Details: </b><br> <b>Email: </b>'+ results[0].email+'<br> <b>Password: </b>'+results[0].password+'<br> <a href="http://localhost:4200/">Click here to login</a></p>'
              }//mailOptions ends here  
              transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log('Email Sent', info.response)
                }
              })
              return res.status(200).json({message: 'Password sent to your email Successfully'})
            }
        }
        else{
            return res.status(500).json(err)
        }
    })
})




var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/login', (req, res) => {
    const user = req.body
    query = "select email, password, role, status from user where email=?"
    connection.query(query,[user.email],(err, results) => {
        if(!err){
            if(results.length <= 0 || results[0].password != user.password){
                return res.status(401).json({message: 'Incorrect uername or password'})
            }
            else if(results[0].status === 'false'){
                return res.status(401).json({message: "Wait for Admin Approval"})
            }
            else if(results[0].password == user.password){
                const response = {
                    email: results[0].email,
                    role: results[0].role
                }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '2h'})
                return res.status(200).json({token: accessToken})
            }
            else{
                return res.status(400).json({message:"Something went Wrong..."})
            }
        }
        else{
            return res.status(500).json(err)
        }
    })



})
router.get('/checkToken', (req, res) => {
    return res.status(200).json({message:'true'})
})



module.exports = router