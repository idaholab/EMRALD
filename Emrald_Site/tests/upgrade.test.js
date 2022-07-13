/**
 * @file Tests scripts/upgrade.js.
 */

const { expect } = chai;

describe('upgrade', () => {
  it('upgrades the model', () => {
    const model = {
      ActionList: [
        {
          Action: {
            mainItem: 'True',
            mutExcl: 'True',
          },
        },
      ],
      EventList: [
        {
          Event: {
            evType: 'etNormalDist',
            mainItem: 'True',
          },
        },
        {
          Event: {
            evType: 'etLogNormalDist',
          },
        },
        {
          Event: {
            evType: 'etExponentialDist',
          },
        },
        {
          Event: {
            evType: 'etWeibullDist',
          },
        },
      ],
      LogicNodeList: [],
    };
    const upgraded = window.upgrade(model);
    expect(upgraded.EventList[0].Event.mainItem).to.be.true;
    expect(upgraded.EventList[0].Event.evType).to.equal('etDistribution');
    expect(upgraded.EventList[0].Event.distType).to.equal('dtNormal');
    expect(upgraded.EventList[1].Event.evType).to.equal('etDistribution');
    expect(upgraded.EventList[1].Event.distType).to.equal('dtLogNormal');
    expect(upgraded.EventList[2].Event.evType).to.equal('etDistribution');
    expect(upgraded.EventList[2].Event.distType).to.equal('dtExponential');
    expect(upgraded.EventList[3].Event.evType).to.equal('etDistribution');
    expect(upgraded.EventList[3].Event.distType).to.equal('dtWeibull');
    expect(upgraded.ActionList[0].Action.mainItem).to.be.true;
    expect(upgraded.ActionList[0].Action.mutExcl).to.be.true;
  });
});
