import request from "supertest";
import { expect } from "chai";

import app from "../../src";

describe('Integration Tests', function() {
  describe('HealthCheck', function() {
    it('returns success when API is up and running', function(done) {
      request
        .agent(app)
        .get('/healthz')
        .end((_, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.message).to.be.equal('Application healthy');

          done();
        });
    })
  });
});
