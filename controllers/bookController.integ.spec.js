var should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    mongoose = require('mongoose'),
    Book = mongoose.model('Book'),
    agent = request.agent(app);

describe('Book CRUD Tests', function() {
  it('Should allow a book to be created and return a read and _id', function(done) {
    var bookPost = {title: 'new book', author: 'Scott', genre: 'Fiction'};

    agent.post('/api/books')
      .send(bookPost)
      .expect(201)
      .end(function(err, results) {
        results.body.read.should.equal(false);
        results.body.should.have.property('_id');
        done(err);
      });
  });

  afterEach(function(done) {
    Book.remove().exec();
    done();
  });
});