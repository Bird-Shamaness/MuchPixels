const request = require('supertest');
const app = require('../app.js');

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /contact', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should return 404', (done) => {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /logout', () => {
  it('should return 302 Found when not logged in', (done) => {
    request(app)
      .get('/logout')
      .expect(302, done);
  });
});

describe('GET /forgot', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/forgot')
      .expect(200, done);
  });
});

describe('GET /photo/hot', () => {
  it('should return 302 FOUND', (done) => {
    request(app)
      .get('/photo/hot')
      .expect(302, done);
  });
});

describe('GET /photo/trending', () => {
  it('should return 302 FOUND', (done) => {
    request(app)
      .get('/photo/trending')
      .expect(302, done);
  });
});
