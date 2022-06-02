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

test('eventsReferencing', async () => {
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
    names(sidebar.eventsReferencing(model, 'Str_', 'Variable')),
  ).toIncludeAllMembers(['TestExtSim']);
  expect(
    names(sidebar.eventsReferencing(model, 'TestComponentLogic', 'Event')),
  ).toIncludeAllMembers(['TestComponentLogic']);
  /*
  expect(
    names(sidebar.eventsReferencing(model, 'ExtSim1', 'ExtSim')),
  ).toIncludeAllMembers(['TestExtSim']);
  */
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
