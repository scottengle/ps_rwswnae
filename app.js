(function() {
  'use strict';

  var express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      app = express(),
      port = process.env.PORT || 3000,
      bookRouter = require('./routes/bookRoutes')();

  var db;
  if(process.env.ENV === 'test') {
    db = mongoose.connect('mongodb://localhost/bookAPI_test');
  } else {
    db = mongoose.connect('mongodb://localhost/bookAPI');
  }
  
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  app.use('/api/books', bookRouter);

  app.get('/', function(req, res){
    res.send('Unsupported route');
  });

  app.listen(port, function() {
    console.log('Running on PORT ' + port);
  });

  module.exports = app;
}());