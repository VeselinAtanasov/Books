const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Testing Book API', () => {
  let bookId;

  it('should create a new book using POST', (done) => {
    const book = { id: "1", title: 'test book', author: 'test author' };
    chai
      .request(server)
      .post('/books')
      .send(book)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body, 'Property id').to.have.property('id');
        expect(res.body.id, 'Property id').to.be.equal(book.id);
        expect(res.body, 'Property title').to.have.property('title');
        expect(res.body).to.have.property('author');
        bookId = res.body.id;
        done();
      });
  });

  it('should retrieve all books via GET', (done) => {
    chai
      .request(server)
      .get('/books')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');

        done();
      });
  });

  it('should return single book by id via GET', (done) => {
    chai
      .request(server)
      .get(`/books/${bookId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('title');
        expect(res.body).to.have.property('author');
        done();
      });
  });

  it('should update a book single book by id via PUT', (done) => {
    const updatedBook = {
      id: bookId,
      title: 'UPDATE test book',
      author: 'UPDATE test author',
    };

    chai
      .request(server)
      .put(`/books/${bookId}`)
      .send(updatedBook)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body, 'Body is an object').to.be.a('object');
        expect(res.body, 'Property id').to.have.property('id');
        expect(res.body.id, 'Property id').to.be.equal(updatedBook.id);
        expect(res.body, 'Property title').to.have.property('title');
        expect(res.body.title, 'Property title').to.be.equal(updatedBook.title);
        expect(res.body, 'Property author').to.have.property('author');
        expect(res.body.author, 'Property author').to.be.equal(
          updatedBook.author
        );
        done();
      });
  });

  it('should delete single book by id via DELETE', (done) => {
    chai
      .request(server)
      .delete(`/books/${bookId}`)
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(res.statusCode).to.be.equal(204);
        done();
      });
  });

  it('should return 404 when trying to GET, PUT, DELETE by non-existing book id', (done) => {
    chai
      .request(server)
      .get(`/books/999`)
      .end((err, res) => {
        expect(res).to.have.status(404);
      });

    chai
      .request(server)
      .put(`/books/999`)
      .send({ id: '000', title: 'demo', author: 'demo2' })
      .end((err, res) => {
        expect(res).to.have.status(404);
      });

    chai
      .request(server)
      .delete(`/books/999`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done()
      });
  });
});
