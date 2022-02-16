
const dotenv= require('dotenv')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('nodelogin', 'root', '', {
    host: "127.0.0.1",
    dialect : 'mysql',
    port: '8111',
    
  });

    
  // sequelize.authenticate().then(function(){
  //       console.log("success");
  //     }).catch(function(error){
  //       console.log("error: "+error);
  // });
 
dotenv.config({
    path: './.env'
})
// const db= mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     port: process.env.PORT,
//     database: process.env.DATABASE
// })

module.exports = sequelize