const express = require('express');
const OAuth2 = require('passport-oauth2');
const passport = require("passport");
const session = require("express-session");

const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// app.get('/', (req, res) => {
//   user_code = req.query.code;
//   console.log(user_code);
//   res.status(200).send({hola:`bienvenido usuario: ${user_code}`})
// })

passport.use(new OAuth2({
  authorizationURL: 'https://app.regtest.getalby.com/oauth',
  tokenURL: 'https://api.regtest.getalby.com/oauth/token',  
  clientID: process.env.ALBY_CLIENT_ID || "test_client",  
  clientSecret: process.env.ALBY_CLIENT_SECRET || "test_secret",  
  callbackURL: process.env.ALBY_CALLBACK_URL || "http://localhost:8080/auth/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
  // });
  return cb(null, {user_id: 10});
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function (req, res) {
    console.log('hola, me he autenticado');
      // User has successfully authenticated, redirect
      res.send({hola:""})
});

app.get('/login', 
  passport.authenticate('oauth2', { 
      scope: ['account:read', 'invoices:read'], 
      successReturnToOrRedirect: '/' 
  })
);

app.listen(8080, () => {
    console.log('working');
});