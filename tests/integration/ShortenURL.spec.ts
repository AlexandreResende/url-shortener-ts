import Sinon from "sinon";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
import request from "supertest";

import app from "../../src";
import URLRepository from "../../src/repositories/Redis/URLRepository";

describe('Integration tests', function() {
  describe('ShortenURL endpoint', function() {
    this.afterEach(() => {
      Sinon.restore();
    });

    it('shortens a URL successfully', function(done) {
      const url = faker.internet.url();

      Sinon.stub(URLRepository.prototype, 'getKey').resolves(null);
      Sinon.stub(URLRepository.prototype, 'setKey').resolves();

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

    it('shortens a URL successfully even when hash already exists', function(done) {
      const url = faker.internet.url();

      Sinon.stub(URLRepository.prototype, 'getKey')
        .onFirstCall().resolves(faker.internet.url())
        .onSecondCall().resolves(null);
      Sinon.stub(URLRepository.prototype, 'setKey').resolves();

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