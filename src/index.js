import express from 'express';
import express_session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bodyParser from 'body-parser'; 

const app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_session({secret: 'dafa'}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy('local',
    function(username, password, done) {
    	console.log(1);
        return done(null, {name: username, role: '/protectede'});
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
        if (req.isAuthenticated() && req.user.role === req.path) {
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

app.get('/protected', authenticationMiddleware(), (req, res) =>{
	 console.log(req.user);
    res.sendFile(__dirname+'/page/protectedPage.html');
});




const server = app.listen(8080, function() {
    console.log(`Server is up and running on port 8080`);
});


