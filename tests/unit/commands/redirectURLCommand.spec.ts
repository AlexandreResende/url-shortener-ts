import { faker } from "@faker-js/faker";
import HashService from "../../../src/services/HashService";
import RedirectURLCommand from "../../../src/commands/RedirectURLCommand";
import db from "../../../src/localDB";
import { expect } from "chai";


describe('Unit test', function() {
  describe('RedirectURLCommand', function() {
    const hashService = new HashService();

    it('returns an URL redirect the user', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      db.set(hashedURL, url);

      const command = new RedirectURLCommand();
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(url);

      db.delete(hashedURL);
    });

    it('returns undefined when hash does not exist', async function() {
      const url = faker.internet.url();
      const hashedURL = hashService.hash(url);

      const command = new RedirectURLCommand();
      const result = await command.execute({ urlId: hashedURL });

      expect(result.url).to.be.equal(undefined);
    });
  });
});