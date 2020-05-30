import express from 'express'
import { AddressInfo } from 'net';
import passport from 'passport';
import path from "path";

var cookieParser = require('cookie-parser');
var session = require('express-session');

var BnetStrategy = require('passport-bnet').Strategy;

var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the BnetStrategy within Passport.
passport.use(
  new BnetStrategy(
    { clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      region: "eu",
      scope: "wow.profile",
      callbackURL: `${process.env.BASE_URL}/auth/bnet/callback` },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    })
);

var app = express();

// configure Express
app.use(cookieParser());
app.use(session({ secret: 'blizzard',
                  saveUninitialized: true,
                  resave: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

import character from "./api/v1/characters"
app.use(character as any)
import ratings from "./api/v1/rating"
app.use(ratings as any)

app.get('/auth/bnet', passport.authenticate('bnet'));

app.get('/auth/bnet/callback', passport.authenticate('bnet', { failureRedirect: '/' }), function(req, res){
  res.redirect('/');
});

app.get("/api/v1/profile", function(req, res) {
    if (req.isAuthenticated()) {
        res.send(req.user)
    } else {
        res.sendStatus(404)
    }
})

app.use(express.static(path.resolve(__dirname, "..", "client", "public")))

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', (server.address()! as AddressInfo).port );
});