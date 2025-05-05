var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//ROUTERS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/api/login');
var fileRouter  = require('./routes/api/files');
var accountsRouter = require('./routes/api/accounts')
var groupsRouter = require('./routes/api/groups')
//-------

console.log("in be now");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/login', loginRouter);
app.use('/api/files', fileRouter);
app.use('/api/accounts',accountsRouter);
app.use('/api/groups', groupsRouter);

app.listen(3001);
module.exports = app;
