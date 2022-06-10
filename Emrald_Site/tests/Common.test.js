/* eslint-disable no-extend-native */
/**
 * @file Tests Common.js.
 */
/// <reference path='../../node_modules/@types/jest/index.d.ts' />
/// <reference path='../../node_modules/jest-extended/types/index.d.ts' />
// @ts-check
import path from 'path';
import wrapper from './wrapper';

let Common;
beforeAll(async () => {
  Common = await wrapper(
    'Common',
    path.resolve('Emrald_Site', 'scripts', 'UI', 'Common.js'),
    [
      '__extends',
      'waitToSync',
      { extend: 'Object.extend' },
      { add: 'Array.prototype.add' },
      'SetOf',
      'classNameOf',
      'getServerFile',
      'deepClone',
      'sortDOMList',
    ],
  );
});

test('waitToSync', async () => new Promise((resolve) => {
  const start = Date.now();
  Common.waitToSync(
    () => false,
    () => {
      const end = Date.now();
      expect((end - start) / 1000).toBeLessThan(3);
      expect((end - start) / 1000).toBeGreaterThan(2);
      resolve();
    },
    2000,
  );

  let i = 0;
  Common.waitToSync(
    () => {
      i += 1;
      return i > 1;
    },
    () => {
      const end = Date.now();
      expect((end - start) / 1000).toBeLessThan(2);
    },
    2000,
  );
}));

test('Object.extend', () => {});

test('Array.prototype.add', () => {
  Array.prototype.add = Common.add;

  const a1 = [];
  a1.add('a');
  expect(a1).toIncludeAllMembers(['a']);
});

test('SetOf', () => {
  expect('c' in Common.SetOf(['a', 'b', 'c', 'd'])).toBeTrue();
});

test('classNameOf', () => {
  expect(Common.classNameOf(new Map())).toBe('Map');
});

/*
test('getServerFile', () => new Promise((resolve) => {
  Common.getServerFile(
    'tests/test-data/ActionsReferencing.json',
    (contents) => {
      expect(contents.length).toBeGreaterThan(0);
      resolve();
    },
  );
}));
*/

test('deepClone', () => {
  expect(Common.deepClone(null)).toBeNull();
  const a1 = ['a', 'b', [new String('c'), 'd']];
  const a2 = Common.deepClone(a1);
  a2[0] = 'e';
  expect(a1[0]).toBe('a');
  expect(a2[0]).toBe('e');
  expect(a2[2][0]).toBe('c');

  const a3 = {
    a: document.createElement('a'),
    b: {
      c: 'd',
    },
  };
  const a4 = Common.deepClone(a3);
  a3.a.setAttribute('href', 'google.com');
  a3.b.c = 'e';
  expect(a4.a.getAttribute('href')).toBeNull();
  expect(a4.b.c).toBe('d');
});
