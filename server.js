const express = require('express');
const app = express();
const mongodb = require('./data/database')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors')
app
  .use(bodyParser.json())
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With, Counter-Type, Accept, Z-key, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH,OPTIONS, DELETE');
  next();
  })
  .use(cors({ methods:['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
  .use(cors({ origin: '*'}))
  .use('/', require('./routes'));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
  return done(null, profile)
}));



passport.serializeUser((user, done) =>{
  done(null, user)
});
passport.deserializeUser((user, done) => {
  done(null, user)
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged out")});

app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs'}),
  (req, res) => {
    req.session.user = req.user;
    console.log(req.user);
    res.redirect('/');
  });

mongodb.initDb((err) => {
  if (err) {
    console.log(err)
  }else {
    app.listen(port, () => {
    console.log(`Database listening and node running on port ${port}`);
});
  }
})

