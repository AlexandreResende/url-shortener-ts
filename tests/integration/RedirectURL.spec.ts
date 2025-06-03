import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../../src';
import db from '../../src/localDB';
import HashService from '../../src/services/HashService';
import Sinon from 'sinon';
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

      Sinon.stub(URLRepository.prototype, 'getKey').resolves(url);

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(301);

          done();
        });
    });

    it('returns a 404 when hashed doesnt not exist', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      Sinon.stub(URLRepository.prototype, 'getKey').resolves(null);

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');

          done();
        });
    });
  });
});