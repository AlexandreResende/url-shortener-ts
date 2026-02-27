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

      const hash = result.url.split('/').pop()!;
      db.delete(hash);
    });

    it('shorten a url successfully when hash already exists', async function() {
      const url = faker.internet.url();
      const hash = hashService.hash(url);

      db.set(hash, {
        originalUrl: 'https://other-url.com',
        hash,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });

      const command = new ShortenURLCommand(hashService);
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);

      const newHash = result.url.split('/').pop()!;
      db.delete(hash);
      db.delete(newHash);
    });

    it('returns existing short URL when the same URL is shortened again', async function() {
      const url = faker.internet.url();

      const command = new ShortenURLCommand(hashService);
      const first = await command.execute({ url });
      const second = await command.execute({ url });

      expect(first.url).to.be.equal(second.url);

      const hash = first.url.split('/').pop()!;
      db.delete(hash);
    });

    it('stores URL record with correct metadata', async function() {
      const url = faker.internet.url();

      const command = new ShortenURLCommand(hashService);
      const result = await command.execute({ url });

      const hash = result.url.split('/').pop()!;
      const record = db.get(hash);

      expect(record).to.not.be.undefined;
      expect(record?.originalUrl).to.be.equal(url);
      expect(record?.clicks).to.be.equal(0);
      expect(record?.createdAt).to.be.instanceOf(Date);
      expect(record?.lastAccessedAt).to.be.null;

      db.delete(hash);
    });
  })
});
