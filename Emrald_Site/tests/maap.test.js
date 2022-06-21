/**
 * @file Tests the MAAP form code.
 */
/// <reference path='../../node_modules/@types/jest/index.d.ts' />
/// <reference path='../../node_modules/jest-extended/types/index.d.ts' />
// @ts-check
import { readTestData } from './util';
import wrapper from './wrapper';

let maapInpParser;
beforeAll(async () => {
  maapInpParser = (
    await wrapper('maap', {
      'EditForms/ExecuteCustomForms/maap-inp-parser.js': [
        { maapInpParser: 'window.maapInpParser' },
      ],
    })
  ).maapInpParser;
});

// First objective is just to get all the files to parse.
// Checking the output objects will be added once all the examples parse succesfully.
describe('maapInpParser', () => {
  test('b1_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('maap/b1_0000.inp', false),
    );
    expect(value).toBeDefined();
  });

  test('b2_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('maap/b2_0000.inp', false),
    );
    expect(value).toBeDefined();
  });

  test('b3_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('maap/b3_0000.inp', false),
    );
    expect(value).toBeDefined();
  });

  test('SG_TIMD', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('maap/SG_TIMD.inp', false),
    );
    expect(value).toBeDefined();
  });
});
