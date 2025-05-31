import { faker } from '@faker-js/faker';
import { expect } from 'chai';

import ShortenURLCommand from "../../../src/commands/ShortenURLCommand";
import HashService from "../../../src/services/HashService";
import db from '../../../src/localDB';
import Sinon from 'sinon';
import URLRepository from '../../../src/repositories/Redis/URLRepository';

describe('Unit tests', function() {
  describe('ShortenURLCommand', function() {
    const hashService = new HashService();

    this.afterEach(() => {
      Sinon.restore();
    });

    it('shorten a url successfully', async function() {
      const url = faker.internet.url();
      const getKey = Sinon.stub().resolves(null);
      const setKey = Sinon.stub().resolves();

      const command = new ShortenURLCommand(
        hashService,
        { getKey, setKey} as unknown as URLRepository
      );
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);
    });

    it('shorten a url successfully when hash already exists', async function() {
      const url = faker.internet.url();
      const hash = hashService.hash(url);
      const getKey = Sinon.stub()
        .onFirstCall().resolves(faker.internet.url())
        .onSecondCall().resolves(null);
      const setKey = Sinon.stub().resolves();

      const command = new ShortenURLCommand(hashService, { getKey, setKey } as unknown as URLRepository);
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);

      const splitted = result.url.split('/');

      db.delete(hash);
      db.delete(splitted[splitted.length - 1]);
    });
  })
});