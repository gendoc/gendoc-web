var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

require('dotenv').config({path: './.env'});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var documentsRouter = require('./routes/documents');
var projectsRouter = require('./routes/projects');
const {connect, send, receive} = require("./messagequeue/rabbitMQClient");
const {updatePDFFileState} = require("./service/documentService");
const {getDocument} = require("./googleApi");



// connect().then(()=>{
//     // 구독하려는 하려는 큐 여기에 넣기
//     receive("pdfCompletionQueue",updatePDFFileState)
// })

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ credentials: true, origin: ['http://localhost:3000','http://gendoc.ai','https://gendoc.ai','http://www.gendoc.ai','https://www.gendoc.ai'] }));

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: {maxAge: 60 * 60 * 1000}, // 1 hour
    })
);




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/documents', documentsRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
