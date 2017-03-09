(function() {
  var express = require('express'),
      bookRouter = express.Router(),
      Book = require('../models/bookModel');

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
      .post(function(req, res) {
        var book = new Book(req.body);
        book.save();
        res.status(201).send(book);      
      })
      .get(function(req, res) {
        var query = {};
        if(req.query.genre) {
          // Course author feels that this is a way of sanitizing user input. I disagree.
          query.genre = req.query.genre;
        }
        Book.find(query, function(err, books) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(books);
          }
        });
      });
    
    bookRouter.route('/:bookId')
      .get(function(req, res) {
        res.json(req.book);
      })
      .put(function(req, res) {
        
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.genre = req.body.genre;
        req.book.read = req.body.read;

        req.book.save(function(err) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(req.book);
          }
        });

      })
      .patch(function(req, res) {

        if(req.body._id) delete req.body._id;
        if(req.body.__v) delete req.body.__v;

        for(var prop in req.body) {
          req.book[prop] = req.body[prop];
        }

        req.book.save(function(err) {
          if(err) {
            res.status(500).send(err);
          } else {
            res.json(req.book);
          }
        });

      })
      .delete(function(req, res) {
        req.book.remove(function(err){
          if(err) {
            res.status(500).send(err);
          } else {
            res.sendStatus(204);
          }
        });
      });
    return bookRouter;
  };

  module.exports = routes;
}());