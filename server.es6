const GOOGLE_CLIENT_ID = '646578251043-7i3q2n8q5t6rrvo1jrvclr82b80n7jns.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'amTA9ELtuwvLsA6ouvoniLkr';

import passport from 'passport';
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(() => done(null, profile));
  }
));

import express from 'express';
let app = express();

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import bodyParser from 'body-parser';
app.use(bodyParser());

import session from 'express-session';
app.use(session({ secret: 'keyboat cat' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname+'/index.html'));
app.get('/user', (req, res) => {
	req.user ? res.json(req.user) : res.status(500);
});
app.get('/auth/google', passport.authenticate('google', { scope: 'openid profile' }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

import { createServer } from 'http';
let server = createServer(app);

import socket from 'socket.io';
let io = socket(server);

io.on('connection', (socket) => {
	console.log('Connected to socket');
	socket.on('message', (message) => {
		console.log(`Emitting message: '${message.toString()}'`)
		io.emit('message', message);
	});
});

server.listen(3000, () => console.log('Listening on 3000'));