/**
 * @file Custom Jest environment.
 */
/* eslint-disable import/no-extraneous-dependencies */
import { TestEnvironment } from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

/**
 * Extends JSDOM with custom global variables for tests.
 */
export default class CustomTestEnvironment extends TestEnvironment {
  /**
   * Sets up the environment.
   */
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
}
