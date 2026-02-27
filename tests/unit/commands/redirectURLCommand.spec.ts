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

      db.set(hashedURL, {
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });

      const command = new RedirectURLCommand({ getKey } as unknown as URLRepository);
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(url);
    });

    it('returns undefined when hash does not exist', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);
      const getKey = Sinon.stub().resolves(null);

      const command = new RedirectURLCommand({ getKey } as unknown as URLRepository);
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(undefined);
    });

    it('increments click count on each access', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      db.set(hashedURL, {
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 0,
        lastAccessedAt: null,
      });

      const command = new RedirectURLCommand();
      await command.execute({ urlId: hashedURL });
      await command.execute({ urlId: hashedURL });

      const record = db.get(hashedURL);
      expect(record?.clicks).to.be.equal(2);
      expect(record?.lastAccessedAt).to.not.be.null;

      db.delete(hashedURL);
    });

    it('returns undefined and deletes record when URL has expired', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      db.set(hashedURL, {
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() - 1000),
        clicks: 0,
        lastAccessedAt: null,
      });

      const command = new RedirectURLCommand();
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(undefined);
      expect(db.get(hashedURL)).to.be.undefined;
    });
  });
});
