/* eslint-disable no-extend-native */
/**
 * @file Tests Common.js.
 */
// @ts-check
const expect = chai.expect;

describe('waitToSync', () => {
  it('waits until timeout', async () => {
    const start = Date.now();
    waitToSync(
      () => false,
      () => {
        const end = Date.now();
        expect((end - start) / 1000).to.be.below(3);
        expect((end - start) / 1000).to.be.above(2);
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
        expect((end - start) / 1000).to.be.below(2);
      },
      2000,
    );
  });
});

describe('SetOf', () => {
  it('creates a set', () => {
    expect('c' in SetOf(['a', 'b', 'c', 'd'])).to.be.true;
  });
});

describe('classNameOf', () => {
  it('gets the class name', () => {
    expect(classNameOf(new Map())).to.equal('Map');
  });
});

describe('deepClone', () => {
  it('clones objects', () => {
    expect(deepClone(null)).to.be.null;
    const a1 = ['a', 'b', [new String('c'), 'd']];
    const a2 = deepClone(a1);
    a2[0] = 'e';
    expect(a1[0]).to.equal('a');
    expect(a2[0]).to.equal('e');
    expect(a2[2][0]).to.equal('c');

    const a3 = {
      a: document.createElement('a'),
      b: {
        c: 'd',
      },
    };
    const a4 = deepClone(a3);
    a3.a.setAttribute('href', 'google.com');
    a3.b.c = 'e';
    expect(a4.a.getAttribute('href')).to.be.null;
    expect(a4.b.c).to.equal('d');
  });
});
