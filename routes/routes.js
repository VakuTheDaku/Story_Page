const express=require('express')
const nodemailer= require('nodemailer')
const sendgridtransporter= require('nodemailer-sendgrid-transport')
const bcrypt= require('bcryptjs')
const ejs= require('ejs')
var User=require('../models/model').User
const path= require('path')
const transporter= nodemailer.createTransport(sendgridtransporter({
    auth: {
        api_key: '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'
    }
}))
const testdrc = path.join(__dirname,'../views/test.ejs')
const router = express.Router()
router.get('/register',(req,res,next)=>{
    const isLoggedIn= req.session.isLoggedIn===true
    res.render('register',{pagetitle: 'Register', name: 'registerpage', isAuthenticated: isLoggedIn, sameemail: false})
})
router.get('/login',(req,res,next)=>{
    const isLoggedIn= req.session.isLoggedIn===true
    res.render('login',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: isLoggedIn, passnomatch: false})
})
router.get('/logout',async (req,res,next)=>{
    const data = await ejs.renderFile(testdrc, { name: req.session.username });
    req.session.destroy((err)=>{
        transporter.sendMail({
            to:'201115@tkmce.ac.in',
            from: 'vinayarunkumarkp3@gmail.com',
            subject: 'Logged Out',
            html: data
        })
        res.redirect('/')
        console.log(err)
    })    
})
router.post('/loginstore',(req,res,next)=>{
    
    email=req.body.email
    password=req.body.password
    
    User.findAll({where: {email: email}}).then(async (user)=>{
        console.log(user[0].password)
        bcrypt.compare(password, user[0].password).then((result)=>{
            if(result) {
                req.session.isLoggedIn=true
                console.log(user[0].name)
                req.session.username=user[0].name
                return res.redirect('/')
            }
            else{
                const isLoggedIn= req.session.isLoggedIn===true
                res.render('login',{pagetitle: 'Login', name: 'loginpage', isAuthenticated: isLoggedIn, passnomatch: true})
            }
    
        }).catch((err)=>console.log(err))
    })
})
router.post('/store',async (req,res,next)=>{
    const {username, email, password}= req.body
    profilepic=req.file
    // const profilepicurl= profilepic.path
    // console.log(profilepicurl)
    console.log(profilepic)
    User.findAll({where: {email: email}}).then(async (users)=>{
        console.log(users[0])
        if(!users[0]){
            let hashedpass =await bcrypt.hash(password, 8)
            User.create({
                name: username,
                email: email,
                password: hashedpass,
            }).then().catch(err=>{
                console.log(err)
            })
            req.session.isLoggedIn =true
            req.session.username=username
            res.redirect('/')
        }
        else{
            req.session.isLoggedIn =false
            const isLoggedIn= req.session.isLoggedIn===true
            res.render('register',{pagetitle: 'Register', name: 'registerpage', isAuthenticated: isLoggedIn, sameemail: true})
        
        }


    }).catch((err)=>console.log(err))
    
})
router.get('/stories',(req,res,next)=>{
    isLoggedIn=req.session.isLoggedIn===true
    res.render('stories',{pagetitle: 'Stories', name: 'storypage', isAuthenticated: isLoggedIn})
  
})
router.get('/poststories',(req,res,next)=>{
    isLoggedIn=req.session.isLoggedIn===true
    if(isLoggedIn){
    res.render('poststories',{pagetitle: 'Stories', name: 'storypage', isAuthenticated: isLoggedIn})}
    else{
        res.redirect('/')
    }
  
})
module.exports=router
