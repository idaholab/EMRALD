/* eslint-disable no-extend-native */
/**
 * @file Tests Common.js.
 */
// @ts-check

describe('waitToSync', () => {
  it('waits until timeout', async () => {
    const start = Date.now();
    waitToSync(
      () => false,
      () => {
        const end = Date.now();
        expect((end - start) / 1000).toBeLessThan(3);
        expect((end - start) / 1000).toBeGreaterThan(2);
      },
      2000,
    );
  });

  it('returns true before timeout', async () => {
    let i = 0;
    const start = Date.now();
    waitToSync(
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
  });
});

describe('Array.prototype.add', () => {
  it('adds to an array', () => {
    const a1 = [];
    a1.add('a');
    expect(a1).toEqual(['a']);
  });
});

describe('SetOf', () => {
  it('creates a set', () => {
    expect('c' in SetOf(['a', 'b', 'c', 'd'])).toBeTrue();
  });
});

describe('classNameOf', () => {
  it('gets the class name', () => {
    expect(classNameOf(new Map())).toBe('Map');
  });
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

describe('deepClone', () => {
  it('clones objects', () => {
    expect(deepClone(null)).toBeNull();
    const a1 = ['a', 'b', [new String('c'), 'd']];
    const a2 = deepClone(a1);
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
    const a4 = deepClone(a3);
    a3.a.setAttribute('href', 'google.com');
    a3.b.c = 'e';
    expect(a4.a.getAttribute('href')).toBeNull();
    expect(a4.b.c).toBe('d');
  });
});
