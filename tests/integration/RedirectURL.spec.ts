import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import Sinon from 'sinon';

import app from '../../src';
import HashService from '../../src/services/HashService';
import URLRepository from '../../src/repositories/Redis/URLRepository';

describe('Integration test', function() {
  describe('RedirectURL', function() {
    const hashService = new HashService();

    this.afterEach(() => {
      Sinon.restore();
    });

    it('redirects the user to the original URL', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      Sinon.stub(URLRepository.prototype, 'findByHash').resolves({
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });
      Sinon.stub(URLRepository.prototype, 'update').resolves();

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(301);

          done();
        });
    });

    it('returns a 404 when hashed does not exist', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      Sinon.stub(URLRepository.prototype, 'findByHash').resolves(null);

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');

          done();
        });
    });

    it('returns a 404 when URL has expired', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      Sinon.stub(URLRepository.prototype, 'findByHash').resolves({
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() - 1000),
        clicks: 0,
        lastAccessedAt: null,
      });
      Sinon.stub(URLRepository.prototype, 'delete').resolves();

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');

          done();
        });
    });

    it('increments click count on redirect', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      Sinon.stub(URLRepository.prototype, 'findByHash').resolves({
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });
      const updateStub = Sinon.stub(URLRepository.prototype, 'update').resolves();

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(301);
          expect(updateStub.calledOnce).to.be.true;

          const updatedRecord = updateStub.firstCall.args[1];
          expect(updatedRecord.clicks).to.be.equal(1);
          expect(updatedRecord.lastAccessedAt).to.not.be.null;

          done();
        });
    });
  });
});
