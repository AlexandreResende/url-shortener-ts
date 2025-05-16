import request from "supertest";
import { expect } from "chai";

import app from "../../src";

describe('Integration Tests', function() {
  describe('HealthCheck', function() {
    it('returns success when API is up and running', function(done) {
      request
        .agent(app)
        .get('/healthz')
        .expect(200)
        .end((_, res) => {
          expect(res.body.message).to.be.equal('Application healthy');

          done();
        });
    })
  });
});
