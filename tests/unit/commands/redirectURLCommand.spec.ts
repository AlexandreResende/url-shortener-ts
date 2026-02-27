import { faker } from "@faker-js/faker";
import { expect } from "chai";
import Sinon from "sinon";

import HashService from "../../../src/services/HashService";
import RedirectURLCommand from "../../../src/commands/RedirectURLCommand";
import URLRepository from "../../../src/repositories/Redis/URLRepository";

describe('Unit test', function() {
  describe('RedirectURLCommand', function() {
    const hashService = new HashService();

    this.afterEach(() => {
      Sinon.restore();
    });

    it('returns an URL redirect the user', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);
      const update = Sinon.stub().resolves();

      const findByHash = Sinon.stub().resolves({
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });

      const command = new RedirectURLCommand(
        { findByHash, update } as unknown as URLRepository
      );
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(url);
      expect(update.calledOnce).to.be.true;
    });

    it('returns undefined when hash does not exist', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);
      const findByHash = Sinon.stub().resolves(null);

      const command = new RedirectURLCommand(
        { findByHash } as unknown as URLRepository
      );
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(undefined);
    });

    it('increments click count on each access', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);
      const update = Sinon.stub().resolves();

      const record = {
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      };
      const findByHash = Sinon.stub().resolves(record);

      const command = new RedirectURLCommand(
        { findByHash, update } as unknown as URLRepository
      );
      await command.execute({ urlId: hashedURL });
      await command.execute({ urlId: hashedURL });

      expect(update.calledTwice).to.be.true;
      expect(record.clicks).to.be.equal(2);
      expect(record.lastAccessedAt).to.not.be.null;
    });

    it('returns undefined and deletes record when URL has expired', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);
      const deleteStub = Sinon.stub().resolves();

      const findByHash = Sinon.stub().resolves({
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() - 1000),
        clicks: 0,
        lastAccessedAt: null,
      });

      const command = new RedirectURLCommand(
        { findByHash, delete: deleteStub } as unknown as URLRepository
      );
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(undefined);
      expect(deleteStub.calledOnce).to.be.true;
    });
  });
});
