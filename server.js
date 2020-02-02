const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');


const teacherRouter = require('./routes/view/teacher');
const studentRouter = require('./routes/view/student');
const apiRouter = require('./routes/rest/api');
const questionRouter = require('./routes/rest/question');
const lectureRouter = require('./routes/rest/lecture');
const answerRouter = require('./routes/rest/answer');
const studentsQuestionRouter = require('./routes/rest/studentQuestion');


const moment = require("moment");

const server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));
server.use(express.static(path.join(__dirname, 'public')));

server.use('/teacher', teacherRouter);
server.use('/student', studentRouter);

server.use('/api', apiRouter);
server.use('/api/question', questionRouter);
server.use('/api/lecture', lectureRouter);
server.use('/api/answer', answerRouter);
server.use('/api/studentQuestion', studentsQuestionRouter);

// catch 404 and forward to error handler
server.use(function (req, res, next) {
    next(createError(404));
});

// error handler
server.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//
server.listen(3000, (req, res) => {
    console.log("Server started on port 3000");
});

module.exports = server;
