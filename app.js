const express=require('express')
const app=express()
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const multer= require('multer')
const model=require('./models/model')
var options = {
	host: 'localhost',
	port: 8111,
	user: 'root',
	password: '',
	database: 'nodelogin',
    
};

var sessionStore = new MySQLStore(options);
const User=model.User
const Story=model.Story
Story.belongsTo(User,{constraints: true, onDelete: 'CASCADE' })
User.hasMany(Story)

const path = require('path')
const routes = require('./routes/routes')
const sequelize= require('./util/database')


const publicdrc = path.join(__dirname,'./public')
app.use(express.static(publicdrc))
app.use(session({
    secret: 'Hey i am vaku the daku', resave: false, saveUninitialized: false,store: sessionStore
}))
app.set('view engine', 'ejs')
const filestorage= multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'images')
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().toISOString().replace(/:/g, '-')+'-'+file.originalname)
    }
})
// const filleFilter=(req,file, cb)=>{
//     if(file.mimetype === 'image/png' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg' ){
//       cb(null, true)  
//     }
//     else{
//      cb(null,true)   
//     }
    
// }

app.use(express.urlencoded({extended: false}))
app.use(multer({storage:filestorage}).single('profilepic'))
app.use(routes)
app.get('/',(req,res,next)=>{
        
        const isLoggedIn= req.session.isLoggedIn===true
        console.log(req.session.isLoggedIn)
        res.render('homepage',{pagetitle: 'Homepage', name: 'mainpage', isAuthenticated: isLoggedIn, username: req.session.username})
    
})
sequelize.sync({force:true}).then(result=>{
    
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})
