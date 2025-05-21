import { faker } from '@faker-js/faker';
import sinon from 'sinon';
import { expect } from 'chai';

import ShortenURLCommand from "../../../src/commands/ShortenURLCommand";
import HashService from "../../../src/services/HashService";

describe('Unit tests', function() {
  describe('ShortenURLCommand', function() {
    const hashService = new HashService();

    it('shorten a url successfully', async function() {
      const url = faker.internet.url();

      const command = new ShortenURLCommand(hashService);
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);
    });
  })
});