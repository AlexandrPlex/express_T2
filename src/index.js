import express from 'express';
import express_session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bodyParser from 'body-parser'; 
import MySQLStore from 'express-mysql-session';
import mysql from 'mysql';

import protectedPage from './page/protectedPage';

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'usbw',
  database: 'test',
};

const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore(options);


const app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_session({store: sessionStore, secret: 'dafa'}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy('local',
    function(username, password, done) {
    	console.log()
    	connection.query(` SELECT * FROM \`test\`.\`users\` WHERE \`username\` = '${username}' AND \`password\`='${password}' `, function (error, results, fields) {
    	  if (error) throw error;
    	  if(results.length){
    	  	return done(null, {name: username, role: '/protectede'});
    	  }else{
        	return done(null, false);
    	  }
    	});
    }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login')
    }
};
// RESTful api handlers

app.get('/login',  (req, res) =>{
    res.sendFile(__dirname+'/page/loginPage.html');
});

// app.post('/login', (req, res)=>{
// 	console.log(req);
// });

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/protected');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/protected', authenticationMiddleware(), (req, res) =>{
    // res.sendFile(__dirname+'/page/protectedPage.html');
    res.send(protectedPage(req.user.name, req.user.role));
});

const server = app.listen(8080, function() {
    console.log(`Server is up and running on port 8080`);
});


