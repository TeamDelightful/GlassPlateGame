var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game')
let gamesHTML = [];

var app = express();

//For logging
var logging = require('py-logging');
require('py-logging/nodekit').install(logging);

app.use(express.static(path.join(__dirname, './public')));
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req,res) => res.sendFile(__dirname, + 'index'));
app.get("/game", (req, res) => res.sendFile(__dirname, + 'host'));
app.listen(27001, () => console.log("Express on: 27001"));


app.post('/game', (req, res) => {
  const game = req.body.gameID;
  const addOrDelete = req.body.addDelete;
  
  if (addOrDelete == 99){

    const index = gamesHTML.findIndex(x => x.gameID === game.gameID);
    logging.info('Got index of game from array: ' + index + ". Can delete page.");

    if (index > -1){
      gamesHTML.splice(index, 1);
    }
    else {
      logging.info('Index was less than -1. Could not delete game from page.');
    }
  }
  else{
    gamesHTML.push(game);
    logging.info('Added game: ' + Object.values(game) + ' to game pages.');
  }
    
});

app.get('/gamesHTML', (req, res) => {
  res.json(gamesHTML);
});

app.get('/game/:gameID', (req, res) => {
  const gameID = req.params.gameID;
  res.locals.gameID = gameID;
  for (let game of gamesHTML) {
    if (game.gameID === gameID){
      res.render("game")
      return;
    }
  }
  res.status(404).send('Game not found');
  
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
