/**
 * @file Tests the Sidebar.
 */
/// <reference path='../node_modules/@types/jest/index.d.ts' />
/// <reference path='../node_modules/jest-extended/types/index.d.ts' />
// @ts-check
const path = require('path');
const { names, readTestData } = require('./util');
const wrapper = require('./wrapper');

const { Navigation } = wrapper(
  path.resolve('scripts', 'UI', 'Sidebar.js'),
  ['Navigation'],
  {
    [`${path.resolve('scripts', 'UI', 'Common.js')}`]: {
      exports: ['__extends', 'waitToSync'],
    },
    [`${path.resolve('config.js')}`]: {
      exports: [{ appConfig: 'window.appConfig' }],
    },
    [`${path.resolve('scripts', 'UI', 'wcfService.js')}`]: {
      exports: ['WcfService'],
      imports: {
        [`${path.resolve('scripts', 'UI', 'Common.js')}`]: {
          exports: ['__extends', 'waitToSync'],
        },
      },
    },
  },
);

const { Sidebar } = Navigation;
const sidebar = new Sidebar();

describe('eventsReferencing', () => {
  test('getting refs', async () => {
    const model = await readTestData('TestProject');
    expect(
      names(sidebar.eventsReferencing(model, 'State1', 'State')),
    ).toIncludeAllMembers(['TestStateChange']);
    expect(
      names(sidebar.eventsReferencing(model, 'LogicTree1', 'LogicTree')),
    ).toIncludeAllMembers(['TestComponentLogic']);
    expect(
      names(sidebar.eventsReferencing(model, 'Int_', 'Variable')),
    ).toIncludeAllMembers([
      'TestTimer',
      'TestFailureRate',
      'TestExtSim',
      'TestDistribution',
    ]);
    expect(
      names(sidebar.eventsReferencing(model, 'Str_3', 'Variable')),
    ).toIncludeAllMembers(['TestExtSim']);
    expect(
      names(sidebar.eventsReferencing(model, 'TestComponentLogic', 'Event')),
    ).toIncludeAllMembers(['TestComponentLogic']);
    expect(sidebar.eventsReferencing(model, 'ExtSim1', 'ExtSim').length).toBe(
      0,
    );
    expect(
      sidebar.eventsReferencing(model, 'Goto_Action2', 'Action').length,
    ).toBe(0);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');
    sidebar.eventsReferencing(model, 'State1', 'State', false, 'State1_');
    expect(
      sidebar.getEventByName(model, 'TestStateChange').Event.triggerStates,
    ).toIncludeAllMembers(['State1_']);
    sidebar.eventsReferencing(
      model,
      'LogicTree1',
      'LogicTree',
      false,
      'LogicTree1_',
    );
    expect(
      sidebar.getEventByName(model, 'TestComponentLogic').Event.logicTop,
    ).toBe('LogicTree1_');
    sidebar.eventsReferencing(model, 'Int_', 'Variable', false, 'Int__');
    expect(sidebar.getEventByName(model, 'TestTimer').Event.time).toBe('Int__');
    expect(sidebar.getEventByName(model, 'TestFailureRate').Event.lambda).toBe(
      'Int__',
    );
    expect(
      sidebar.getEventByName(model, 'TestExtSim').Event.varNames,
    ).toIncludeAllMembers(['Int__']);
    expect(
      sidebar
        .getEventByName(model, 'TestDistribution')
        .Event.parameters.find((p) => p.useVariable).variable,
    ).toBe('Int__');
    expect(sidebar.getEventByName(model, 'TestExtSim').Event.code).toBe(
      'Int__',
    );
    sidebar.eventsReferencing(model, 'Str_3', 'Variable', false, 'Str__3');
    expect(sidebar.getEventByName(model, 'TestExtSim').Event.variable).toBe(
      'Str__3',
    );
    sidebar.eventsReferencing(
      model,
      'TestComponentLogic',
      'Event',
      false,
      'TestLogicTree',
    );
    expect(sidebar.getEventByName(model, 'TestComponentLogic')).toBeNull();
    expect(sidebar.getEventByName(model, 'TestLogicTree')).not.toBeNull();
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');
    sidebar.eventsReferencing(model, 'Int_', 'Variable', true);
    expect(sidebar.getEventByName(model, 'TestTimer').Event.time).toBeNull();
    expect(
      sidebar.getEventByName(model, 'TestFailureRate').Event.lambda,
    ).toBeNull();
    expect(
      sidebar.getEventByName(model, 'TestExtSim').Event.varNames.length,
    ).toBe(0);
    expect(
      sidebar
        .getEventByName(model, 'TestDistribution')
        .Event.parameters.find((p) => p.useVariable).variable,
    ).toBeNull();
    expect(
      sidebar.getEventByName(model, 'TestVarCond').Event.varNames.length,
    ).toBe(0);
    sidebar.eventsReferencing(model, 'Str_', 'Variable', true);
    expect(
      sidebar.getEventByName(model, 'TestExtSim').Event.varaible,
    ).toBeUndefined();
    sidebar.eventsReferencing(model, 'Str_3', 'Variable', true);
    expect(
      sidebar.getEventByName(model, 'TestExtSim').Event.variable,
    ).toBeNull();
    sidebar.eventsReferencing(model, 'State1', 'State', true);
    expect(
      sidebar.getEventByName(model, 'TestStateChange').Event.triggerStates
        .length,
    ).toBe(0);
    sidebar.eventsReferencing(model, 'LogicTree1', 'LogicTree', true);
    expect(
      sidebar.getEventByName(model, 'TestComponentLogic').Event.logicTop,
    ).toBe('');
  });
});

test('actionsReferencing', async () => {
  const model = await readTestData('TestProject');

  // Getting references
  expect(
    names(sidebar.actionsReferencing(model, 'State2', 'State')),
  ).toIncludeAllMembers(['TestTransition']);
  expect(
    names(sidebar.actionsReferencing(model, 'Int_', 'Variable')),
  ).toIncludeAllMembers(['TestTransition', 'TestCngVar', 'TestOpenErrorPro']);
  expect(
    names(sidebar.actionsReferencing(model, 'Bool_', 'Variable')),
  ).toIncludeAllMembers(['TestCngVar', 'TestRunApp']);
  expect(
    names(sidebar.actionsReferencing(model, 'Str_3', 'Variable')),
  ).toIncludeAllMembers(['TestExtSim']);
  expect(
    names(sidebar.actionsReferencing(model, 'Str_2', 'Variable')),
  ).toIncludeAllMembers(['TestOpenErrorPro']);
  expect(
    names(sidebar.actionsReferencing(model, 'ExtSim1', 'ExtSim')),
  ).toIncludeAllMembers(['TestExtSim']);
});

test('statesReferencing', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(sidebar.statesReferencing(model, 'TestStateChange', 'Event')),
  ).toIncludeAllMembers(['State2']);
  expect(
    names(sidebar.statesReferencing(model, 'TestTransition', 'Action')),
  ).toIncludeAllMembers(['State1']);
  expect(
    names(sidebar.statesReferencing(model, 'Goto_Action2', 'Action')),
  ).toIncludeAllMembers(['State2']);
  expect(
    names(sidebar.statesReferencing(model, 'Main', 'Diagram')),
  ).toIncludeAllMembers(['State1', 'State2']);
});

test('diagramsReferencing', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(sidebar.diagramsReferencing(model, 'State1', 'State')),
  ).toIncludeAllMembers(['Main']);
  expect(
    names(sidebar.diagramsReferencing(model, 'State2', 'State')),
  ).toIncludeAllMembers(['Main']);
});

test('logicNodesReferencing', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(sidebar.logicNodesReferencing(model, 'Component', 'Diagram')),
  ).toIncludeAllMembers(['LogicTree1']);
  expect(
    names(sidebar.logicNodesReferencing(model, 'LogicTree1', 'LogicTree')),
  ).toIncludeAllMembers(['gate_2']);
});

test('variableReferencing', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(sidebar.variableReferencing(model, 'State3', 'State')),
  ).toIncludeAllMembers(['TestAccrual']);
});

test('extSimsReferencing', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(sidebar.extSimsReferencing(model, 'ExtSim1', 'ExtSim')),
  ).toIncludeAllMembers(['ExtSim1']);
});
