(function() {
  'use strict';

  var urlencode = require('urlencode');

  var bookController = function(Book) {

    function getAllBooks(req, res) {
      var query = {};
      if(req.query.genre) {
        // Course author feels that this is a way of sanitizing user input. I disagree.
        query.genre = req.query.genre;
      }
      Book.find(query, function(err, books) {
        if(err) {
          res.status(500).send(err);
        } else {
          var results = [];
          books.forEach(function(elem, index, arr){
            var newBook = elem.toJSON(); // strips out all mongoose special properties
            newBook._links = {};
            newBook._links.self = req.protocol + "://" + req.headers.host + '/api/books/' + newBook._id;
            newBook._links.genre = req.protocol + "://" + req.headers.host + '/api/books?genre=' + urlencode(newBook.genre);
            results.push(newBook);
          });
          res.json(results);
        }
      });
    }
    
    function getBook(req, res) {
      var result = req.book.toJSON(); // strips out all mongoose special properties
      result._links = {};
      result._links.self = req.protocol + "://" + req.headers.host + '/api/books/' + result._id;
      result._links.similar = req.protocol + "://" + req.headers.host + '/api/books?genre=' + urlencode(result.genre);
      res.json(result);
    }

    function createBook(req, res) {
      if(req.body.title) {
        var book = new Book(req.body);
        book.save();
        res.status(201);
        res.send(book);  
      } else {
        res.status(400);
        res.send('Title is required');
      }
    }

    function updateBook(req, res) {
      req.book.title = req.body.title;
      req.book.author = req.body.author;
      req.book.genre = req.body.genre;
      req.book.read = req.body.read;

      req.book.save(function(err) {
        if(err) {
          res.status(500);
          res.send(err);
        } else {
          res.json(req.book);
        }
      });
    }

    function patchBook(req, res) {
      if(req.body._id) delete req.body._id;
      if(req.body.__v) delete req.body.__v;

      for(var prop in req.body) {
        req.book[prop] = req.body[prop];
      }

      req.book.save(function(err) {
        if(err) {
          res.status(500);
          res.send(err);
        } else {
          res.json(req.book);
        }
      });
    }

    function deleteBook(req, res) {
      req.book.remove(function(err){
        if(err) {
          res.status(500);
          res.send(err);
        } else {
          res.sendStatus(204);
        }
      });
    }

    return {
      getAllBooks: getAllBooks,
      getBook: getBook,
      createBook: createBook,
      updateBook: updateBook,
      patchBook: patchBook,
      deleteBook: deleteBook
    };

  };

  module.exports = bookController;
}());