import { faker } from "@faker-js/faker";
import request from "supertest";
import { expect } from "chai";

import app from "../../src";

describe('Integration tests', function() {
  describe('ShortenURL endpoint', function() {
    it('shortens a URL successfully', function(done) {
      const url = faker.internet.url();

      request
        .agent(app)
        .post('/shorten')
        .send({ url })
        .end((_, res) => {
          const body = res.body;

          expect(res.status).to.be.equal(200);
          expect(typeof body.url).to.be.equal('string');
          expect(body.url).to.be.not.equal(url);

          done();
        });
    });

    it('returns a 400 - Bad Request when an URL is not passed', function(done) {
      request
        .agent(app)
        .post('/shorten')
        .send({ url: undefined })
        .end((_, res) => {
          const body = res.body;

          expect(res.status).to.be.equal(400);
          expect(typeof body.error).to.be.equal('object');
          expect(body.error.length).to.be.equal(1);
          expect(body.error[0]).to.be.equal('"url" is required');

          done();
        });
    });
  });
});