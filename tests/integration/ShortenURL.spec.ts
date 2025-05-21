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
  });
});