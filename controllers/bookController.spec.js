var should = require('should'),
    sinon = require('sinon');

describe('Book Controller Tests', function() {
  describe('Post Route', function() {
    it('should not allow an empty title on POST', function() {
      var Book = function(book) {
        this.save = function(){};
      };

      var req = {
        body: {
          author: 'Scott'
        }
      };

      var res = {
        status: sinon.spy(), 
        send: sinon.spy()
      };

      var bookController = require('./bookController')(Book);
      bookController.createBook(req, res);

      res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
      res.send.calledWith('Title is required').should.equal(true);
    });
  });
});