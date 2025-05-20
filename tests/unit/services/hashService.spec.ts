import { faker } from "@faker-js/faker";
import { expect } from "chai";

import HashService from "../../../src/services/HashService";

describe('Unit tests', function() {
  describe('HashService', function() {
    it('hashes a long string with a fixed size length of 6', function() {
      const hashService = new HashService();
      const input = faker.word.words();

      const result = hashService.hash(input);

      expect(result.length).to.be.equal(6);
    });
  });
});