
const express = require('express');
const assert = require('assert');
const request = require('supertest');
const app = express();

describe('User Details API', () => {
  describe('POST /api/userDetails', () => {
    it('should retrieve user details when a valid userId is provided', (done) => {
      const userId = 1; 
      request(app)
        .post('/api/userDetails')
        .send({ userId })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          assert.strictEqual(res.body.message.id, userId);
          assert.strictEqual(res.body.message.name, 'John Doe');

          done();
        });
    });

    it('should return an error when an invalid userId is provided', (done) => {
      const userId = 3; 
      request(app)
        .post('/api/userDetails')
        .send({ userId })
        .expect(500)
        .end((err, res) => {
          if (err) return done(err);

          // Add your assertions here
          assert.strictEqual(res.body.message, 'Something went wrong');

          done();
        });
    });
  });
});


describe('All Users API', () => {
    describe('POST /api/allUsers', () => {
      it('should retrieve all users', (done) => {
        request(app)
          .post('/api/allUsers')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
  
            // Add your assertions here
            assert.strictEqual(res.body.message.length, 2); 
            assert.strictEqual(res.body.message[0].id, 1); 
  
            done();
          });
      });
  
      it('should return an error when something goes wrong', (done) => {
        request(app)
          .post('/api/allUsers')
          .expect(500)
          .end((err, res) => {
            if (err) return done(err);
  
            // Add your assertions here
            assert.strictEqual(res.body.message, 'Something went wrong');
  
            done();
          });
      });
    });
  });
