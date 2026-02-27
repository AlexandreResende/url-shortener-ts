import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import Sinon from 'sinon';

import ShortenURLCommand from "../../../src/commands/ShortenURLCommand";
import HashService from "../../../src/services/HashService";
import URLRepository from '../../../src/repositories/Redis/URLRepository';

describe('Unit tests', function() {
  describe('ShortenURLCommand', function() {
    const hashService = new HashService();

    this.afterEach(() => {
      Sinon.restore();
    });

    it('shorten a url successfully', async function() {
      const url = faker.internet.url();
      const findByUrl = Sinon.stub().resolves(null);
      const exists = Sinon.stub().resolves(false);
      const save = Sinon.stub().resolves();

      const command = new ShortenURLCommand(
        hashService,
        { findByUrl, exists, save } as unknown as URLRepository
      );
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);
      expect(save.calledOnce).to.be.true;
    });

    it('shorten a url successfully when hash already exists', async function() {
      const url = faker.internet.url();
      const findByUrl = Sinon.stub().resolves(null);
      const exists = Sinon.stub()
        .onFirstCall().resolves(true)
        .onSecondCall().resolves(false);
      const save = Sinon.stub().resolves();

      const command = new ShortenURLCommand(
        hashService,
        { findByUrl, exists, save } as unknown as URLRepository
      );
      const result = await command.execute({ url });

      expect(typeof result.url).to.be.equal('string');
      expect(result.url).to.be.not.equal(url);
      expect(save.calledOnce).to.be.true;
    });

    it('returns existing short URL when the same URL is shortened again', async function() {
      const url = faker.internet.url();
      const hash = hashService.hash(url);

      const findByUrl = Sinon.stub().resolves({
        originalUrl: url,
        hash,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });
      const exists = Sinon.stub().resolves(false);
      const save = Sinon.stub().resolves();

      const command = new ShortenURLCommand(
        hashService,
        { findByUrl, exists, save } as unknown as URLRepository
      );
      const result = await command.execute({ url });

      expect(result.url).to.contain(hash);
      expect(save.called).to.be.false;
    });

    it('stores URL record with correct metadata', async function() {
      const url = faker.internet.url();
      const findByUrl = Sinon.stub().resolves(null);
      const exists = Sinon.stub().resolves(false);
      const save = Sinon.stub().resolves();

      const command = new ShortenURLCommand(
        hashService,
        { findByUrl, exists, save } as unknown as URLRepository
      );
      await command.execute({ url });

      expect(save.calledOnce).to.be.true;
      const savedRecord = save.firstCall.args[1];
      expect(savedRecord.originalUrl).to.be.equal(url);
      expect(savedRecord.clicks).to.be.equal(0);
      expect(savedRecord.createdAt).to.be.instanceOf(Date);
      expect(savedRecord.lastAccessedAt).to.be.null;
    });
  })
});
