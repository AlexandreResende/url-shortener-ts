import { faker } from '@faker-js/faker';
import { expect } from 'chai';

import ShortenURLCommand from "../../../src/commands/ShortenURLCommand";
import HashService from "../../../src/services/HashService";
import db from '../../../src/localDB';

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

    it('shorten a url successfully when hash already exists', async function() {
      const url = faker.internet.url();
      const hash = hashService.hash(url);

      const command = new ShortenURLCommand(hashService);
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);

      const splitted = result.url.split('/');

      db.delete(hash);
      db.delete(splitted[splitted.length - 1]);
    });
  })
});