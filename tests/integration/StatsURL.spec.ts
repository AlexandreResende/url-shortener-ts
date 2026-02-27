import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import app from '../../src';
import db from '../../src/localDB';
import HashService from '../../src/services/HashService';

describe('Integration test', function() {
  describe('StatsURL', function() {
    const hashService = new HashService();

    it('returns stats for an existing shortened URL', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      db.set(hashedURL, {
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 3,
        lastAccessedAt: new Date(),
      });

      request
        .agent(app)
        .get(`/stats/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.originalUrl).to.be.equal(url);
          expect(res.body.clicks).to.be.equal(3);

          db.delete(hashedURL);

          done();
        });
    });

    it('returns 404 for a non-existent hash', function(done) {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      request
        .agent(app)
        .get(`/stats/${hashedURL}`)
        .end((_, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.body.message).to.be.equal('Not found');

          done();
        });
    });
  });
});
