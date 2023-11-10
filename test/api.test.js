const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Testing Book API', () => {
  let bookId;

  it('should create a new book using POST', (done) => {
    const book = { id: 1, title: 'test book', author: 'test author' };
    chai
      .request(server)
      .post('/books')
      .send(book)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('author');
        bookId = res.body.id;
        done();
      });
  });
});
