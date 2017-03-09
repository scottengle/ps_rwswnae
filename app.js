(function() {
  var express = require('express'),
      app = express(),
      port = process.env.PORT || 3000;
  
  app.get('/', function(req, res){
    res.send('Welcome to my API');
  });

  app.listen(port, function() {
    console.log('Running on PORT ' + port);
  });

}());