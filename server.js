const http = require('http');
const express = require('express');
const router = express();
const bodyParser = require('body-parser');
require('dotenv').config()
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
const mysql = require('mysql');

var path = require('path').join(__dirname,'/public');
router.use(express.static(path));

router.set('view engine','ejs');

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.database_user,
    password: process.env.database_password,
    database: 'gnukhata'
});

connection.connect(function(err) {
    if (!err) {
        console.log('Connected to MySql!\n');
    } else {
        console.log(err);
    }
});
var id = 1;

/* REGISTRATION */
router.post('/submit',(req,res)=>{
    const name = req.body.name;
    const age = req.body.age;
    const sport = req.body.sport;
    const pass = req.body.psw;
    console.log(sport);

    connection.query('insert into student(studentname,age,sport,pass) values(?,?,?,?)',[name,age,sport,pass],function(error,results,fields){
    if(error)
    {
        console.log(error);
        res.sendStatus(400);
    }
    else
        {
            connection.query('SELECT studentid FROM student WHERE studentname=? AND pass=?',[name,pass],function(error,results,fields){
                if (error){
                    res.sendStatus(400);
                }
                else{
                    console.log("Successfully Registered!")
                    console.log(id)
                    id = results[0].studentid;
                    res.redirect("accounts");;
                }
            });
        }
    });
});

/* EDIT */
router.post('/edit',(req,res)=>{
    const name = req.body.name;
    const age = req.body.age;
    const sport = req.body.sport;

    connection.query('UPDATE student SET studentname=?,age=?,sport=?  WHERE studentid=?',[name,age,sport,id],function(error,results,fields){
    if(error)
    {
        console.log(error);
        res.sendStatus(400);
    }
    else
        {
            console.log("Successfully Updated!")
                    console.log(id)
                    id = results[0].studentid;
                    res.redirect("accounts");
        }
    });
});

/*LOGIN*/
router.post('/login', (req, res) =>{
     const name = req.body.name;
     var pass = req.body.psw;
     //Query to select the tuple of the user
     connection.query('SELECT * FROM student WHERE studentname = ?',[name], function (error, results, fields) {
     if (error) {
      console.log(error);
      res.status(404);
     }else{
       if(results.length >0){
          //User exists
          if(results[0].pass == pass){
             //Users password match
            connection.query('SELECT studentid FROM student WHERE studentname=? AND pass=?',[name,pass],function(error,results,fields){
                if (error){
                    res.sendStatus(400);
                }
                else{
                    console.log(id)
                    console.log("Successfully login!")
                    id = results[0].studentid;
                    res.redirect("accounts");;
                }
            });
            
          }
            else{
            //Users password do not match
            res.render("login1",{results:'Incorrect Username and/or Password!'});
                
          }
       }
       else{
         //User does not exist
         res.render("login1",{results:'Incorrect Username!'});
       }
      }
    });
});

/*VIEW*/
router.get('/accounts',(req,res)=>{

    //search for student
    connection.query('SELECT * FROM student WHERE studentid=?',[id],function(error,results,fields){
        if (error){
            res.sendStatus(400);
        }
        else{
            res.render("accounts",{results:results});
        }
    });
});

/*CANCEL*/
router.get('/delete',(req,res)=>{

    //search for student
    connection.query('DELETE FROM student WHERE studentid=?',[id],function(error,results,fields){
        if (error){
            res.sendStatus(400);
        }
        else{

            res.redirect("form");
        }
    });
});

router.get('/cancel',(req,res)=>{
res.render("login");
});

/*VIEWLIST*/
router.get('/admin', (req, res) =>{
    //fetching from events table
    connection.query('SELECT studentname,age,sport FROM student order by studentname ASC', function (error, result, fields) {
    if (error){
        res.sendStatus(400);
    }
    else
        res.render("admin",{results:result});
    });
});

router.get('/badminton', (req, res) =>{
    //fetching from events table
    connection.query('SELECT studentname,age,sport FROM student WHERE sport="Badminton" order by studentname ASC', function (error, result, fields) {
    if (error){
        res.sendStatus(400);
    }
    else
        res.render("admin",{results:result});
    });
});

router.get('/cricket', (req, res) =>{
    //fetching from events table
    connection.query('SELECT studentname,age,sport FROM student WHERE sport="Cricket" order by studentname ASC', function (error, result, fields) {
    if (error){
        res.sendStatus(400);
    }
    else
        res.render("admin",{results:result});
    });
});
router.get('/football', (req, res) =>{
    //fetching from events table
    connection.query('SELECT studentname,age,sport FROM student WHERE sport="Football" order by studentname ASC', function (error, result, fields) {
    if (error){
        res.sendStatus(400);
    }
    else
        res.render("admin",{results:result});
    });
});
router.get('/hockey', (req, res) =>{
    //fetching from events table
    connection.query('SELECT studentname,age,sport FROM student WHERE sport="Hockey" order by studentname ASC', function (error, result, fields) {
    if (error){
        res.sendStatus(400);
    }
    else
        res.render("admin",{results:result});
    });
});
router.get("/", (req,res)=>{
// return res.sendFile("home.ejs", { root: path.join(__dirname, '/views') });
res.render("form/form");
});

router.get("/edit", (req,res)=>{

    //search for student
    connection.query('SELECT * FROM student WHERE studentid=?',[id],function(error,results,fields){
        if (error){
            res.sendStatus(400);
        }
        else{
            res.render("edit",{results:results});
        }
    });
});

router.get("/form", (req,res)=>{
res.render("form/form");
});

router.get("/login", (req,res)=>{
res.render("login");
});

//port activation
router.listen(4000, (req, res) => {
    console.log("Listening on 4000");
});