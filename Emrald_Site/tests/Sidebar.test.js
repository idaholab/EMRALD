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

test('getExtSimList', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(
      sidebar.getExtSimList(
        model.StateList.map((s) => s.State),
        model,
      ),
    ),
  ).toIncludeAllMembers(['ExtSim1']);
});

test('getLogicNodeList', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(
      sidebar.getLogicNodeList(
        model.StateList.map((s) => s.State),
        model,
      ),
    ),
  ).toIncludeAllMembers(['LogicTree1', 'gate_2']);
});

test('getVariableList', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(
      sidebar.getVariableList(
        model.StateList.map((s) => s.State),
        model,
      ),
    ),
  ).toIncludeAllMembers(['Bool_', 'Int_', 'Str_2', 'Str_3']);
});

test('getDiagramList', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(
      sidebar.getDiagramList(
        model.StateList.map((s) => s.State),
        model,
      ),
    ),
  ).toIncludeAllMembers(['Main', 'Component']);
});

test('getActionList', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(
      sidebar.getActionList(
        model.StateList.map((s) => s.State),
        model,
      ),
    ),
  ).toIncludeAllMembers([
    'TestTransition',
    'TestCngVar',
    'TestOpenErrorPro',
    'TestRunApp',
    'TestExtSim',
    'Goto_Action2',
  ]);
});

test('getEventList', async () => {
  const model = await readTestData('TestProject');

  expect(
    names(
      sidebar.getEventList(
        model.StateList.map((s) => s.State),
        model,
      ),
    ),
  ).toIncludeAllMembers([
    'TestStateChange',
    'TestComponentLogic',
    'TestTimer',
    'TestFailureRate',
    'TestExtSim',
    'TestDistribution',
  ]);
});

describe('eventsReferencing', () => {
  test('gettings refs', async () => {
    const model = await readTestData('TestProject');

    expect(sidebar.eventsReferencing(model, 'ExtSim1', 'ExtSim').length).toBe(
      0,
    );
    expect(
      names(sidebar.eventsReferencing(model, 'Int_', 'Variable')),
    ).toIncludeAllMembers([
      'TestDistribution',
      'TestFailureRate',
      'TestTimer',
      'TestVarCond',
      'TestExtSim',
    ]);
    expect(
      names(sidebar.eventsReferencing(model, 'Str_3', 'Variable')),
    ).toIncludeAllMembers(['TestExtSim']);
    expect(
      names(sidebar.eventsReferencing(model, 'State1', 'State')),
    ).toIncludeAllMembers(['TestStateChange']);
    expect(
      names(sidebar.eventsReferencing(model, 'LogicTree1', 'LogicTree')),
    ).toIncludeAllMembers(['TestComponentLogic']);
    expect(
      names(sidebar.eventsReferencing(model, 'TestComponentLogic', 'Event')),
    ).toIncludeAllMembers(['TestComponentLogic']);
    expect(
      sidebar.eventsReferencing(model, 'Goto_Action2', 'Action').length,
    ).toBe(0);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.eventsReferencing(model, 'Int_', 'Variable', false, 'Int__');
    sidebar.eventsReferencing(model, 'Str_3', 'Variable', false, 'Str__3');
    sidebar.eventsReferencing(model, 'State1', 'State', false, 'State1_');
    sidebar.eventsReferencing(
      model,
      'LogicTree1',
      'LogicTree',
      false,
      'LogicTree1_',
    );
    sidebar.eventsReferencing(
      model,
      'TestComponentLogic',
      'Event',
      false,
      'TestComponentLogic_',
    );

    expect(sidebar.getEventByName(model, 'TestComponentLogic')).toBeNull();
    const testComponentLogic = sidebar.getEventByName(
      model,
      'TestComponentLogic_',
    );
    const testDistribution = sidebar.getEventByName(model, 'TestDistribution');
    const testExtSim = sidebar.getEventByName(model, 'TestExtSim');
    const testFailureRate = sidebar.getEventByName(model, 'TestFailureRate');
    const testStateChange = sidebar.getEventByName(model, 'TestStateChange');
    const testTimer = sidebar.getEventByName(model, 'TestTimer');
    const testVarCond = sidebar.getEventByName(model, 'TestVarCond');

    expect(
      testDistribution.Event.parameters.find((p) => p.useVariable).variable,
    ).toBe('Int__');
    expect(testExtSim.Event.variable).toBe('Str__3');
    expect(testExtSim.Event.code).toBe('Int__');
    expect(testExtSim.Event.varNames).toIncludeAllMembers(['Int__']);
    expect(testFailureRate.Event.lambda).toBe('Int__');
    expect(testTimer.Event.time).toBe('Int__');
    expect(testVarCond.Event.code).toBe('Int__');
    expect(testVarCond.Event.varNames).toIncludeAllMembers(['Int__']);
    expect(testStateChange.Event.triggerStates).toIncludeAllMembers([
      'State1_',
    ]);
    expect(testComponentLogic.Event.logicTop).toBe('LogicTree1_');
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.eventsReferencing(model, 'Int_', 'Variable', true);
    sidebar.eventsReferencing(model, 'Str_3', 'Variable', true);
    sidebar.eventsReferencing(model, 'State1', 'State', true);
    sidebar.eventsReferencing(model, 'LogicTree1', 'LogicTree', true);

    const testComponentLogic = sidebar.getEventByName(
      model,
      'TestComponentLogic',
    );
    const testDistribution = sidebar.getEventByName(model, 'TestDistribution');
    const testExtSim = sidebar.getEventByName(model, 'TestExtSim');
    const testFailureRate = sidebar.getEventByName(model, 'TestFailureRate');
    const testStateChange = sidebar.getEventByName(model, 'TestStateChange');
    const testTimer = sidebar.getEventByName(model, 'TestTimer');
    const testVarCond = sidebar.getEventByName(model, 'TestVarCond');

    expect(
      testDistribution.Event.parameters.find((p) => p.useVariable).variable,
    ).toBe('');
    expect(testExtSim.Event.variable).toBe('');
    expect(testExtSim.Event.varNames.length).toBe(0);
    expect(testFailureRate.Event.lambda).toBe('');
    expect(testTimer.Event.time).toBe('');
    expect(testVarCond.Event.varNames.length).toBe(0);
    expect(testStateChange.Event.triggerStates.length).toBe(0);
    expect(testComponentLogic.Event.logicTop).toBe('');
  });
});

describe('actionsReferencing', () => {
  test('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.actionsReferencing(model, 'State2', 'State')),
    ).toIncludeAllMembers(['TestTransition']);
    expect(
      names(sidebar.actionsReferencing(model, 'ExtSim1', 'ExtSim')),
    ).toIncludeAllMembers(['TestExtSim']);
    expect(
      names(sidebar.actionsReferencing(model, 'Int_', 'Variable')),
    ).toIncludeAllMembers(['TestCngVar', 'TestOpenErrorPro', 'TestTransition']);
    expect(
      names(sidebar.actionsReferencing(model, 'Bool_', 'Variable')),
    ).toIncludeAllMembers(['TestCngVar', 'TestRunApp']);
    expect(
      names(sidebar.actionsReferencing(model, 'Str_2', 'Variable')),
    ).toIncludeAllMembers(['TestOpenErrorPro']);
    expect(
      names(sidebar.actionsReferencing(model, 'Str_3', 'Variable')),
    ).toIncludeAllMembers(['TestExtSim']);
    expect(
      names(sidebar.actionsReferencing(model, 'TestCngVar', 'Action')),
    ).toIncludeAllMembers(['TestCngVar']);
    expect(sidebar.actionsReferencing(model, 'TestTimer', 'Event').length).toBe(
      0,
    );
    expect(
      sidebar.actionsReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).toBe(0);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.actionsReferencing(model, 'State2', 'State', false, 'State2_');
    sidebar.actionsReferencing(model, 'ExtSim1', 'ExtSim', false, 'ExtSim1_');
    sidebar.actionsReferencing(model, 'Int_', 'Variable', false, 'Int__');
    sidebar.actionsReferencing(model, 'Bool_', 'Variable', false, 'Bool__');
    sidebar.actionsReferencing(model, 'Str_2', 'Variable', false, 'Str__2');
    sidebar.actionsReferencing(model, 'Str_3', 'Variable', false, 'Str__3');
    sidebar.actionsReferencing(
      model,
      'TestCngVar',
      'Action',
      false,
      'TestCngVar_',
    );

    expect(sidebar.getActionByName(model, 'TestCngVar')).toBeNull();
    const testCngVar = sidebar.getActionByName(model, 'TestCngVar_');
    const testExtSim = sidebar.getActionByName(model, 'TestExtSim');
    const testOpenErrorPro = sidebar.getActionByName(model, 'TestOpenErrorPro');
    const testRunApp = sidebar.getActionByName(model, 'TestRunApp');
    const testTransition = sidebar.getActionByName(model, 'TestTransition');

    expect(
      testTransition.Action.newStates.map((s) => s.toState),
    ).toIncludeAllMembers(['State2_']);
    expect(testExtSim.Action.extSim).toBe('ExtSim1_');
    expect(testCngVar.Action.variableName).toBe('Int__');
    expect(testCngVar.Action.scriptCode).toBe('Bool__');
    expect(testCngVar.Action.codeVariables).toIncludeAllMembers(['Bool__']);
    expect(testExtSim.Action.sim3DVariable).toBe('Str__3');
    expect(testOpenErrorPro.Action.formData.varLinks[0].variable.name).toBe(
      'Str__2',
    );
    expect(testRunApp.Action.codeVariables).toIncludeAllMembers(['Bool__']);
    expect(testRunApp.Action.makeInputFileCode).toBe('Bool__');
    expect(testRunApp.Action.processOutputFileCode).toBe('Bool__');
    expect(testTransition.Action.newStates[0].varProb).toBe('Int__');
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.actionsReferencing(model, 'State2', 'State', true);
    sidebar.actionsReferencing(model, 'ExtSim1', 'ExtSim', true);
    sidebar.actionsReferencing(model, 'Int_', 'Variable', true);
    sidebar.actionsReferencing(model, 'Bool_', 'Variable', true);
    sidebar.actionsReferencing(model, 'Str_2', 'Variable', true);
    sidebar.actionsReferencing(model, 'Str_3', 'Variable', true);

    const testCngVar = sidebar.getActionByName(model, 'TestCngVar');
    const testExtSim = sidebar.getActionByName(model, 'TestExtSim');
    const testOpenErrorPro = sidebar.getActionByName(model, 'TestOpenErrorPro');
    const testRunApp = sidebar.getActionByName(model, 'TestRunApp');
    const testTransition = sidebar.getActionByName(model, 'TestTransition');

    expect(testTransition.Action.newStates.length).toBe(0);
    expect(testExtSim.Action.extSim).toBe('');
    expect(testCngVar.Action.variableName).toBe('');
    expect(testCngVar.Action.codeVariables.length).toBe(0);
    expect(testExtSim.Action.sim3DVariable).toBe('');
    expect(testOpenErrorPro.Action.formData.varLinks[0].variable.name).toBe('');
    expect(testRunApp.Action.codeVariables.length).toBe(0);
    expect(testTransition.Action.newStates.length).toBe(0);
  });
});

describe('statesReferencing', () => {
  test('getting refs', async () => {
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
    expect(
      names(sidebar.statesReferencing(model, 'State1', 'State')),
    ).toIncludeAllMembers(['State1']);
    expect(sidebar.statesReferencing(model, 'ExtSim1', 'ExtSim').length).toBe(
      0,
    );
    expect(sidebar.statesReferencing(model, 'Int_', 'Variable').length).toBe(0);
    expect(
      sidebar.statesReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).toBe(0);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.statesReferencing(
      model,
      'TestStateChange',
      'Event',
      false,
      false,
      false,
      'TestStateChange_',
    );
    sidebar.statesReferencing(
      model,
      'TestTransition',
      'Action',
      false,
      false,
      false,
      'TestTransition_',
    );
    sidebar.statesReferencing(
      model,
      'Goto_Action2',
      'Action',
      false,
      false,
      false,
      'Goto_Action3',
    );
    sidebar.statesReferencing(
      model,
      'Main',
      'Diagram',
      false,
      false,
      false,
      'Main_',
    );
    sidebar.statesReferencing(
      model,
      'State1',
      'State',
      false,
      false,
      false,
      'State1_',
    );

    expect(sidebar.getStateByName(model, 'State1')).toBeNull();
    const state1 = sidebar.getStateByName(model, 'State1_');
    const state2 = sidebar.getStateByName(model, 'State2');

    expect(state2.State.events.indexOf('TestStateChange')).toBe(-1);
    expect(
      state2.State.events.indexOf('TestStateChange_'),
    ).toBeGreaterThanOrEqual(0);
    expect(state1.State.immediateActions.indexOf('TestTransition')).toBe(-1);
    expect(
      state1.State.immediateActions.indexOf('TestTransition_'),
    ).toBeGreaterThanOrEqual(0);
    expect(state2.State.eventActions[0].actions[0]).toBe('Goto_Action3');
    expect(state1.State.diagramName).toBe('Main_');
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.statesReferencing(model, 'TestStateChange', 'Event', true);
    sidebar.statesReferencing(model, 'TestTransition', 'Action', true);
    sidebar.statesReferencing(model, 'Goto_Action2', 'Action', true);
    sidebar.statesReferencing(model, 'Main', 'Diagram', true);
    sidebar.statesReferencing(model, 'State1', 'State', true);

    const state1 = sidebar.getStateByName(model, 'State1');
    const state2 = sidebar.getStateByName(model, 'State2');

    expect(state2.State.events.indexOf('TestStateChange')).toBe(-1);
    expect(state1.State.immediateActions.indexOf('TestTransition')).toBe(-1);
    expect(state2.State.eventActions[0].actions.length).toBe(0);
    expect(state1.State.diagramName).toBe('');
  });
});

describe('diagramsReferencing', () => {
  test('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.diagramsReferencing(model, 'State1', 'State')),
    ).toIncludeAllMembers(['Main']);
    expect(
      names(sidebar.diagramsReferencing(model, 'Main', 'Diagram')),
    ).toIncludeAllMembers(['Main']);
    expect(
      sidebar.diagramsReferencing(model, 'TestTransition', 'Action').length,
    ).toBe(0);
    expect(
      sidebar.diagramsReferencing(model, 'TestTimer', 'Event').length,
    ).toBe(0);
    expect(sidebar.diagramsReferencing(model, 'ExtSim1', 'ExtSim').length).toBe(
      0,
    );
    expect(sidebar.diagramsReferencing(model, 'Int_', 'Variable').length).toBe(
      0,
    );
    expect(
      sidebar.diagramsReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).toBe(0);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.diagramsReferencing(model, 'State1', 'State', false, 'State1_');
    sidebar.diagramsReferencing(model, 'Main', 'Diagram', false, 'Main_');

    expect(sidebar.getDiagramByName(model, 'Main')).toBeNull();
    const main = sidebar.getDiagramByName(model, 'Main_');

    expect(main.Diagram.states.indexOf('State1')).toBe(-1);
    expect(main.Diagram.states.indexOf('State1_')).toBeGreaterThanOrEqual(0);
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.diagramsReferencing(model, 'State1', 'State', true);

    const main = sidebar.getDiagramByName(model, 'Main');

    expect(main.Diagram.states.indexOf('State1')).toBe(-1);
  });
});

describe('logicNodesReferencing', () => {
  test('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.logicNodesReferencing(model, 'Component', 'Diagram')),
    ).toIncludeAllMembers(['LogicTree1']);
    expect(
      names(sidebar.logicNodesReferencing(model, 'gate_2', 'LogicTree')),
    ).toIncludeAllMembers(['LogicTree1']);
    expect(
      names(sidebar.logicNodesReferencing(model, 'LogicTree1', 'LogicTree')),
    ).toIncludeAllMembers(['LogicTree1', 'gate_2']);
    expect(
      sidebar.logicNodesReferencing(model, 'TestTransition', 'Action').length,
    ).toBe(0);
    expect(
      sidebar.logicNodesReferencing(model, 'TestTimer', 'Event').length,
    ).toBe(0);
    expect(
      sidebar.logicNodesReferencing(model, 'ExtSim1', 'ExtSim').length,
    ).toBe(0);
    expect(
      sidebar.logicNodesReferencing(model, 'Int_', 'Variable').length,
    ).toBe(0);
    expect(sidebar.logicNodesReferencing(model, 'State1', 'State').length).toBe(
      0,
    );
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.logicNodesReferencing(
      model,
      'Component',
      'Diagram',
      false,
      'Component_',
    );
    sidebar.logicNodesReferencing(
      model,
      'gate_2',
      'LogicTree',
      false,
      'gate__2',
    );
    sidebar.logicNodesReferencing(
      model,
      'LogicTree1',
      'LogicTree',
      false,
      'LogicTree1_',
    );

    expect(sidebar.getLogicNodeByName(model, 'LogicTree1')).toBeNull();
    const logicTree1 = sidebar.getLogicNodeByName(model, 'LogicTree1_');

    expect(logicTree1.LogicNode.compChildren).toIncludeAllMembers([
      'Component_',
    ]);
    expect(logicTree1.LogicNode.gateChildren).toIncludeAllMembers(['gate__2']);
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.logicNodesReferencing(model, 'Component', 'Diagram', true);
    sidebar.logicNodesReferencing(model, 'gate_2', 'LogicTree', true);

    const logicTree1 = sidebar.getLogicNodeByName(model, 'LogicTree1');

    expect(logicTree1.LogicNode.compChildren.length).toBe(0);
    expect(logicTree1.LogicNode.gateChildren.length).toBe(0);

    const model2 = await readTestData('TestProject');

    sidebar.logicNodesReferencing(model2, 'LogicTree1', 'LogicTree', true);

    const gate2 = sidebar.getLogicNodeByName(model2, 'gate_2');

    expect(gate2.LogicNode.rootName).toBe('');
  });
});

describe('variableReferencing', () => {
  test('gettings refs', async () => {
    const model = await readTestData('TestProject');

    expect(sidebar.variableReferencing(model, 'Main', 'Diagram').length).toBe(
      0,
    );
    expect(
      sidebar.variableReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).toBe(0);
    expect(
      sidebar.variableReferencing(model, 'TestTransition', 'Action').length,
    ).toBe(0);
    expect(
      sidebar.variableReferencing(model, 'TestTimer', 'Event').length,
    ).toBe(0);
    expect(sidebar.variableReferencing(model, 'ExtSim1', 'ExtSim').length).toBe(
      0,
    );
    expect(
      names(sidebar.variableReferencing(model, 'Int_', 'Variable')),
    ).toIncludeAllMembers(['Int_']);
    expect(
      names(sidebar.variableReferencing(model, 'State3', 'State')),
    ).toIncludeAllMembers(['TestAccrual']);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.variableReferencing(
      model,
      'TestAccrual',
      'Variable',
      false,
      'TestAccrual_',
    );
    sidebar.variableReferencing(model, 'State3', 'State', false, 'State3_');

    expect(sidebar.getVariableByName(model, 'TestAcrrual')).toBeNull();
    const testAccrual = sidebar.getVariableByName(model, 'TestAccrual_');

    expect(testAccrual.Variable.accrualStatesData[0].stateName).toBe('State3_');
  });

  test('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.variableReferencing(model, 'State3', 'State', true);

    const testAccrual = sidebar.getVariableByName(model, 'TestAccrual');

    expect(testAccrual.Variable.accrualStatesData.length).toBe(0);
  });
});

describe('extSimsReferencing', () => {
  test('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(sidebar.extSimsReferencing(model, 'Main', 'Diagram').length).toBe(0);
    expect(
      sidebar.extSimsReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).toBe(0);
    expect(
      sidebar.extSimsReferencing(model, 'TestTransition', 'Action').length,
    ).toBe(0);
    expect(sidebar.extSimsReferencing(model, 'TestTimer', 'Event').length).toBe(
      0,
    );
    expect(sidebar.extSimsReferencing(model, 'Int_', 'Variable').length).toBe(
      0,
    );
    expect(
      names(sidebar.extSimsReferencing(model, 'ExtSim1', 'ExtSim')),
    ).toIncludeAllMembers(['ExtSim1']);
    expect(sidebar.extSimsReferencing(model, 'State1', 'State').length).toBe(0);
  });

  test('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.extSimsReferencing(model, 'ExtSim1', 'ExtSim', false, 'ExtSim1_');

    expect(sidebar.getExtSimByName(model, 'ExtSim1')).toBeNull();
    expect(sidebar.getExtSimByName(model, 'ExtSim1_')).not.toBeNull();
  });
});
