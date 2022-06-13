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

describe('maapInpParser', () => {
  test('b1_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('maap/b1_0000.inp', false),
    );

    expect(value.length).toBe(10);
    expect(value[0]).toMatchObject({
      type: 'sensitivity',
      value: 'ON',
    });
    expect(value[1]).toMatchObject({
      type: 'title',
      value: 'Baseline BWR Case 1: Mark I Unmitigated ELAP',
    });
    expect(value[2]).toMatchObject({
      type: 'parameter_file',
      value: 'peach505.par',
    });
    expect(value[3]).toMatchObject({
      type: 'include',
      value: 'plot_bwr.inc',
    });
    expect(value[4]).toMatchObject({
      type: 'units',
      value: 'SI',
    });
    expect(value[5]).toMatchObject({
      type: 'parameter_change',
      value: null,
    });
    expect(value[6]).toMatchObject({
      type: 'time',
      value: {
        time: 'START TIME',
        value: {
          type: 'number',
          value: 0,
        },
      },
    });
    expect(value[7]).toMatchObject({
      type: 'time',
      value: {
        time: 'END TIME',
        value: {
          type: 'number',
          value: 144000,
        },
      },
    });
    expect(value[8]).toMatchObject({
      type: 'print_interval',
      value: {
        type: 'number',
        value: 5000,
      },
    });
    expect(value[9].type).toBe('initiators');
    expect(value[9].value.length).toBe(4);
    expect(value[9].value[0]).toMatchObject({
      type: 'parameter_name',
      value: 'MSIVS LOCKED CLOSED',
    });
    expect(value[9].value[1]).toMatchObject({
      type: 'parameter_name',
      value: 'LOSS OF AC POWER',
    });
    expect(value[9].value[2]).toMatchObject({
      type: 'parameter_name',
      value: 'LOSS OF DIESEL POWER',
    });
    expect(value[9].value[3]).toMatchObject({
      type: 'parameter_name',
      value: 'HPCI LOCKED OFF',
    });
  });

  test('b2_0000', async () => {
    const { value } = maapInpParser.parse(
      await readTestData('maap/b2_0000.inp', false),
    );

    expect(value.length).toBe(12);
    expect(value[10].type).toBe('when');
    expect(value[10].value.test.type).toBe('expression');
    expect(value[10].value.test.value.left.type).toBe('expression_member');
    expect(value[10].value.test.value.left.value.base).toMatchObject({
      type: 'identifier',
      value: 'TIME',
    });
    expect(value[10].value.test.value.op).toBe('>');
    expect(value[10].value.test.value.right.type).toBe('expression_member');
    expect(value[10].value.test.value.right.value.base).toMatchObject({
      type: 'number',
      value: 14,
    });
    expect(value[10].value.test.value.units).toBe('HR');
    expect(value[10].value.value.length).toBe(9);
    expect(value[10].value.value[0].type).toBe('assignment');
    expect(value[10].value.value[0].value.target.type)
      .toBe('expression_member');
    expect(value[10].value.value[0].value.target.value.base).toMatchObject({
      type: 'identifier',
      value: 'WVHPSW',
    });
    expect(value[10].value.value[0].value.target.value.index).toBe(1);
    expect(value[10].value.value[0].value.value.type).toBe('expression_member');
    expect(value[10].value.value[0].value.value.value.base).toMatchObject({
      type: 'number',
      value: 1604,
    });
    expect(value[10].value.value[0].value.units).toBe('FT3/HR');
    expect(value[10].value.value[1].value.target.value.index).toBe(2);
    expect(value[10].value.value[2].value.target.value.index).toBe(3);
    expect(value[10].value.value[3].value.target.value.index).toBe(4);
    expect(value[10].value.value[4].value.target.value.index).toBe(5);
    expect(value[10].value.value[5].value.target.value.index).toBe(6);
    expect(value[10].value.value[6].value.target.value.index).toBe(7);
    expect(value[10].value.value[7].value.target.value.index).toBe(8);
    expect(value[10].value.value[8]).toMatchObject({
      type: 'parameter_name',
      value: 'HPSW INJECTION MAN ON',
    });
    expect(value[11].type).toBe('when');
    expect(value[11].value.value.length).toBe(1);
    expect(value[11].value.test.value.left.value.base).toMatchObject({
      type: 'identifier',
      value: 'PRB',
    });
    expect(value[11].value.test.value.left.value.index).toBe(2);
    expect(value[11].value.test.value.op).toBe('>');
    expect(value[11].value.test.value.right.value.base).toMatchObject({
      type: 'number',
      value: 74,
    });
    expect(value[11].value.test.value.units).toBe('PSIA');
    expect(value[11].value.value[0].value.target.value.base).toMatchObject({
      type: 'identifier',
      value: 'JFRB',
    });
    expect(value[11].value.value[0].value.target.value.index).toBe(21);
  });
});
