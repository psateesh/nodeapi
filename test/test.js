
const express = require('express');
const assert = require('assert');
const request = require('supertest');
const app = express();

const assert = require('assert');
const request = require('supertest');
const app = require('./your_app'); // Replace with the path to your app file

describe('POST /api/userDetails/', () => {
  it('should return user details when valid request is made', (done) => {
    const userDetails = {
      userId: '1',
    };

    request(app)
      .post('/api/userDetails/')
      .send(userDetails)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        assert.deepStrictEqual(res.body.message, "successfully fetched "); 
        done();
      });
  });

  it('should return error message when request body is invalid', (done) => {
    const userDetails = {
    };

    request(app)
      .post('/api/userDetails/')
      .send(userDetails)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'Invalid request body');
        done();
      });
  });

  it('should return error message when user does not have permission', (done) => {
    const userDetails = {
      userId: '2',
    };

    request(app)
      .post('/api/userDetails/')
      .send(userDetails)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'You do not have permission to view others details');
        done();
      });
  });

  it('should return error message when an error occurs in the server', (done) => {
    const userDetails = {
      userId: '99',
    };

    const originalFindOne = User.findOne;
    User.findOne = () => {
      throw new Error('No Data Found');
    };

    request(app)
      .post('/api/userDetails/')
      .send(userDetails)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'No data found');
        User.findOne = originalFindOne;
        done();
      });
  });
});


describe('POST /api/deleteUser/', () => {
  it('should delete the user when valid request is made by an admin', (done) => {
    const deleteUserRequest = {
      userId: '5',
    };

    const originalDecodeAccessToken = decodeAccessToken;
    decodeAccessToken = () => ({
      userType: 'admin',
    });

    request(app)
      .post('/api/deleteUser/')
      .send(deleteUserRequest)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'User has been removed');
        done();
      });
  });

  it('should return error message when request body is invalid', (done) => {
    const deleteUserRequest = {
    };

    request(app)
      .post('/api/deleteUser/')
      .send(deleteUserRequest)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'Invalid request body');
        done();
      });
  });

  it('should return error message when user is not an admin', (done) => {
    const deleteUserRequest = {
      userId: '1',
    };

    const originalDecodeAccessToken = decodeAccessToken;
    decodeAccessToken = () => ({
      userType: 'regular',
    });

    request(app)
      .post('/api/deleteUser/')
      .send(deleteUserRequest)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'You do not have permission to delete user');
        done();
      });
  });

  it('should return error message when the user does not exist', (done) => {
    const deleteUserRequest = {
      userId: '',
    };

    const originalDestroy = User.destroy;
    User.destroy = () => Promise.resolve(0);

    request(app)
      .post('/api/deleteUser/')
      .send(deleteUserRequest)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'User not exist');
        done();
      });
  });

  it('should return error message when an error occurs in the server', (done) => {
    const deleteUserRequest = {
      userId: '99',
    };

    const originalDestroy = User.destroy;
    User.destroy = () => Promise.reject(new Error('Something went wrong'));

    request(app)
      .post('/api/deleteUser/')
      .send(deleteUserRequest)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.message, 'Something went wrong');

        User.destroy = originalDestroy;
        done();
      });
  });
});