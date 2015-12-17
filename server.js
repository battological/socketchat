'use strict';

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportGoogleOauth = require('passport-google-oauth');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _http = require('http');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// should probably hide these... sorry google!  
var GOOGLE_CLIENT_ID = '646578251043-7i3q2n8q5t6rrvo1jrvclr82b80n7jns.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'amTA9ELtuwvLsA6ouvoniLkr';

_passport2.default.serializeUser(function (user, done) {
  return done(null, user);
});
_passport2.default.deserializeUser(function (obj, done) {
  return done(null, obj);
});

_passport2.default.use(new _passportGoogleOauth.OAuth2Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile);
  });
}));

var app = (0, _express2.default)();

app.use((0, _cookieParser2.default)());

app.use((0, _bodyParser2.default)());

app.use((0, _expressSession2.default)({ secret: 'keyboat cat' }));

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

app.use(_express2.default.static('public'));

app.get('/', function (req, res) {
  return res.sendFile(__dirname + '/index.html');
});
app.get('/user', function (req, res) {
  req.user ? res.json(req.user) : res.status(500);
});
app.get('/auth/google', _passport2.default.authenticate('google', { scope: 'openid profile' }));

app.get('/auth/google/callback', _passport2.default.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
});

var server = (0, _http.createServer)(app);

var io = (0, _socket2.default)(server);

io.on('connection', function (socket) {
  console.log('Connected to socket');
  socket.on('message', function (message) {
    console.log('Emitting message: \'' + message.toString() + '\'');
    io.emit('message', message);
  });
});

server.listen(3000, function () {
  return console.log('Listening on 3000');
});
