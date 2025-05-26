import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../../src';
import db from '../../src/localDB';
import HashService from '../../src/services/HashService';

describe('Integration test', function() {
  describe('RedirectURL', function() {
    const hashService = new HashService();

    it('redirects the user to the original URL', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      db.set(hashedURL, url);

      request
        .agent(app)
        .get(`/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(301);

          db.delete(hashedURL);

          done();
        });
    });

    it('returns a 404 when hashed doest not exist', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

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