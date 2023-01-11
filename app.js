const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const hbs = require('express-handlebars');
const handlebars = require("handlebars")
const dbConnect = require('./config/db')
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const session = require('express-session')
const app = express();
dbConnect.dbConnect()

const _=require('lodash')

// view engine setup
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs',);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 24 * 1 * 1000 },
}));

handlebars.registerHelper('truncate', function (string, length) {
  return _.truncate(string, { 'length': length });
});



// prevent cache last page
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
})

app.use('/admin', adminRouter);
app.use('/', usersRouter);



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
