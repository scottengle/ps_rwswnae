(function() {
  'use strict';

  var express = require('express'),
      bookRouter = express.Router(),
      Book = require('../models/bookModel'),
      bookController = require('../controllers/bookController')(Book);

  var routes = function() {

    bookRouter.use('/:bookId', function(req, res, next) {
      Book.findById(req.params.bookId, function(err, book) {
          if(err) {
            res.status(500).send(err);
          } else if(book){
            req.book = book;
            next();
          } else {
            res.status(404).send('no book found');
          }
        });
    });
    
    bookRouter.route('/')
      .post(bookController.createBook)
      .get(bookController.getAllBooks);
    
    bookRouter.route('/:bookId')
      .get(bookController.getBook)
      .put(bookController.updateBook)
      .patch(bookController.patchBook)
      .delete(bookController.deleteBook);
      
    return bookRouter;
  };

  module.exports = routes;
}());