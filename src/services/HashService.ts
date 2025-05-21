import crypto from "crypto";

import ENVIRONMENT from "../Environment";
import { Lifecycle, registry, scoped } from "tsyringe";


@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'HashService', useClass: HashService }])
export default class HashService {
  private readonly inputLength: number;

  constructor() {
    this.inputLength = this.calculateInputLength();
  }

  hash(input: string): string {
    var cipher = crypto.createCipheriv('aes-128-cbc', ENVIRONMENT.CRYPTOGRAPHY.SECRET, ENVIRONMENT.CRYPTOGRAPHY.IV);
    var cipheredString = cipher.update(input, 'utf8', 'hex')
    cipheredString += cipher.final('hex');

    return cipheredString.slice(0, this.inputLength);
  }

  private calculateInputLength(): number {
    const totalRequests = ENVIRONMENT.CAPACITY.AMOUNT_OF_REQUEST_PER_MONTH;
    const totalCharacters = 56; // [a-zA-z0-9]
    let size = 0;

    while (Math.pow(totalCharacters, size) < totalRequests) {
      size++;
    } 

    return size;
  }
}
