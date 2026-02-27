import { faker } from "@faker-js/faker";
import HashService from "../../../src/services/HashService";
import StatsURLCommand from "../../../src/commands/StatsURLCommand";
import db from "../../../src/localDB";
import { expect } from "chai";


describe('Unit test', function() {
  describe('StatsURLCommand', function() {
    const hashService = new HashService();

    it('returns stats for an existing URL', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      db.set(hashedURL, {
        originalUrl: url,
        hash: hashedURL,
        createdAt: new Date(),
        expiresAt: null,
        clicks: 5,
        lastAccessedAt: new Date(),
      });

      const command = new StatsURLCommand();
      const result = await command.execute({ urlId: hashedURL });

      expect(result).to.not.be.undefined;
      expect(result?.originalUrl).to.be.equal(url);
      expect(result?.clicks).to.be.equal(5);
      expect(result?.createdAt).to.be.instanceOf(Date);

      db.delete(hashedURL);
    });

    it('returns undefined for a non-existent URL', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      const command = new StatsURLCommand();
      const result = await command.execute({ urlId: hashedURL });

      expect(result).to.be.undefined;
    });

    it('returns undefined and deletes record for an expired URL', async function() {
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

      const command = new StatsURLCommand();
      const result = await command.execute({ urlId: hashedURL });

      expect(result).to.be.undefined;
      expect(db.get(hashedURL)).to.be.undefined;
    });
  });
});
