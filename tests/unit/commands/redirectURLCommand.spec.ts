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

      const getKey = Sinon.stub().resolves(url);

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
  });
});