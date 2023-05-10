/**
 * @file Tests the Sidebar.
 */
/// <reference path="./util.js" />
// @ts-check

const sidebar = simApp.mainApp.sidebar;
const { expect } = chai;

describe('getExtSimList', () => {
  it('lists all ext sims', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(
        sidebar.getExtSimList(
          model.StateList.map((s) => s.State),
          model,
        ),
      ),
    ).to.have.members(['ExtSim1']);
  });
});

describe('getLogicNodeList', () => {
  it('lists all logic nodes', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(
        sidebar.getLogicNodeList(
          model.StateList.map((s) => s.State),
          model,
        ),
      ),
    ).to.have.members(['LogicTree1']);
  });
});

describe('getVariableList', () => {
  it('lists all variables', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(
        sidebar.getVariableList(
          model.StateList.map((s) => s.State),
          model,
        ),
      ),
    ).to.have.members(['Bool_', 'Int_', 'Str_2', 'Str_3']);
  });
});

describe('getDiagramList', () => {
  it('lists all diagrams', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(
        sidebar.getDiagramList(
          model.StateList.map((s) => s.State),
          model,
        ),
      ),
    ).to.have.members(['Main', 'Component']);
  });
});

describe('getActionList', () => {
  it('lists all actions', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(
        sidebar.getActionList(
          model.StateList.map((s) => s.State),
          model,
        ),
      ),
    ).to.have.members([
      'TestTransition',
      'TestCngVar',
      'TestOpenErrorPro',
      'TestRunApp',
      'TestExtSim',
      'Goto_Action2',
    ]);
  });
});

describe('getEventList', () => {
  it('lists all events', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(
        sidebar.getEventList(
          model.StateList.map((s) => s.State),
          model,
        ),
      ),
    ).to.have.members([
      'TestStateChange',
      'TestComponentLogic',
      'TestTimer',
      'TestFailureRate',
      'TestExtSim',
      'TestDistribution',
    ]);
  });
});

describe('eventsReferencing', () => {
  it('gettings refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      sidebar.eventsReferencing(model, 'ExtSim1', 'ExtSim').length,
    ).to.equal(0);
    expect(
      names(sidebar.eventsReferencing(model, 'Int_', 'Variable')),
    ).to.have.members([
      'TestDistribution',
      'TestFailureRate',
      'TestTimer',
      'TestVarCond',
      'TestExtSim',
    ]);
    expect(
      names(sidebar.eventsReferencing(model, 'Str_3', 'Variable')),
    ).to.have.members(['TestExtSim']);
    expect(
      names(sidebar.eventsReferencing(model, 'State1', 'State')),
    ).to.have.members(['TestStateChange']);
    expect(
      names(sidebar.eventsReferencing(model, 'LogicTree1', 'LogicTree')),
    ).to.have.members(['TestComponentLogic']);
    expect(
      names(sidebar.eventsReferencing(model, 'TestComponentLogic', 'Event')),
    ).to.have.members(['TestComponentLogic']);
    expect(
      sidebar.eventsReferencing(model, 'Goto_Action2', 'Action').length,
    ).to.equal(0);
  });

  it('renaming refs', async () => {
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

    expect(sidebar.getEventByName(model, 'TestComponentLogic')).to.be.null;
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
    ).to.equal('Int__');
    expect(testExtSim.Event.variable).to.equal('Str__3');
    expect(testExtSim.Event.code).to.equal('Int__');
    expect(testExtSim.Event.varNames).to.have.members(['Int__']);
    expect(testFailureRate.Event.lambda).to.equal('Int__');
    expect(testTimer.Event.time).to.equal('Int__');
    expect(testVarCond.Event.code).to.equal('Int__');
    expect(testVarCond.Event.varNames).to.have.members(['Int__']);
    expect(testStateChange.Event.triggerStates).to.have.members(['State1_']);
    expect(testComponentLogic.Event.logicTop).to.equal('LogicTree1_');
  });

  it('deleting refs', async () => {
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
    ).to.equal('');
    expect(testExtSim.Event.variable).to.equal('');
    expect(testExtSim.Event.varNames.length).to.equal(0);
    expect(testFailureRate.Event.lambda).to.equal('');
    expect(testTimer.Event.time).to.equal('');
    expect(testVarCond.Event.varNames.length).to.equal(0);
    expect(testStateChange.Event.triggerStates.length).to.equal(0);
    expect(testComponentLogic.Event.logicTop).to.equal('');
  });
});

describe('actionsReferencing', () => {
  it('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.actionsReferencing(model, 'State2', 'State')),
    ).to.have.members(['TestTransition']);
    expect(
      names(sidebar.actionsReferencing(model, 'ExtSim1', 'ExtSim')),
    ).to.have.members(['TestExtSim']);
    expect(
      names(sidebar.actionsReferencing(model, 'Int_', 'Variable')),
    ).to.have.members(['TestCngVar', 'TestOpenErrorPro', 'TestTransition']);
    expect(
      names(sidebar.actionsReferencing(model, 'Bool_', 'Variable')),
    ).to.have.members(['TestCngVar', 'TestRunApp']);
    expect(
      names(sidebar.actionsReferencing(model, 'Str_2', 'Variable')),
    ).to.have.members(['TestOpenErrorPro']);
    expect(
      names(sidebar.actionsReferencing(model, 'Str_3', 'Variable')),
    ).to.have.members(['TestExtSim']);
    expect(
      names(sidebar.actionsReferencing(model, 'TestCngVar', 'Action')),
    ).to.have.members(['TestCngVar']);
    expect(
      sidebar.actionsReferencing(model, 'TestTimer', 'Event').length,
    ).to.equal(0);
    expect(
      sidebar.actionsReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).to.equal(0);
  });

  it('renaming refs', async () => {
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

    expect(sidebar.getActionByName(model, 'TestCngVar')).to.be.null;
    const testCngVar = sidebar.getActionByName(model, 'TestCngVar_');
    const testExtSim = sidebar.getActionByName(model, 'TestExtSim');
    const testOpenErrorPro = sidebar.getActionByName(model, 'TestOpenErrorPro');
    const testRunApp = sidebar.getActionByName(model, 'TestRunApp');
    const testTransition = sidebar.getActionByName(model, 'TestTransition');

    expect(
      testTransition.Action.newStates.map((s) => s.toState),
    ).to.have.members(['State2_']);
    expect(testExtSim.Action.extSim).to.equal('ExtSim1_');
    expect(testCngVar.Action.variableName).to.equal('Int__');
    expect(testCngVar.Action.scriptCode).to.equal('Bool__');
    expect(testCngVar.Action.codeVariables).to.have.members(['Bool__']);
    expect(testExtSim.Action.sim3DVariable).to.equal('Str__3');
    expect(testOpenErrorPro.Action.formData.varLinks[0].variable.name).to.equal(
      'Str__2',
    );
    expect(testRunApp.Action.codeVariables).to.have.members(['Bool__']);
    expect(testRunApp.Action.makeInputFileCode).to.equal('Bool__');
    expect(testRunApp.Action.processOutputFileCode).to.equal('Bool__');
    expect(testTransition.Action.newStates[0].varProb).to.equal('Int__');
  });

  it('deleting refs', async () => {
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

    expect(testTransition.Action.newStates.length).to.equal(0);
    expect(testExtSim.Action.extSim).to.equal('');
    expect(testCngVar.Action.variableName).to.equal('');
    expect(testCngVar.Action.codeVariables.length).to.equal(0);
    expect(testExtSim.Action.sim3DVariable).to.equal('');
    expect(testOpenErrorPro.Action.formData.varLinks[0].variable.name).to.equal(
      '',
    );
    expect(testRunApp.Action.codeVariables.length).to.equal(0);
    expect(testTransition.Action.newStates.length).to.equal(0);
  });
});

describe('statesReferencing', () => {
  it('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.statesReferencing(model, 'TestStateChange', 'Event')),
    ).to.have.members(['State2']);
    expect(
      names(sidebar.statesReferencing(model, 'TestTransition', 'Action')),
    ).to.have.members(['State1']);
    expect(
      names(sidebar.statesReferencing(model, 'Goto_Action2', 'Action')),
    ).to.have.members(['State2']);
    expect(
      names(sidebar.statesReferencing(model, 'Main', 'Diagram')),
    ).to.have.members(['State1', 'State2']);
    expect(
      names(sidebar.statesReferencing(model, 'State1', 'State')),
    ).to.have.members(['State1']);
    expect(
      sidebar.statesReferencing(model, 'ExtSim1', 'ExtSim').length,
    ).to.equal(0);
    expect(
      sidebar.statesReferencing(model, 'Int_', 'Variable').length,
    ).to.equal(0);
    expect(
      sidebar.statesReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).to.equal(0);
  });

  it('renaming refs', async () => {
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

    expect(sidebar.getStateByName(model, 'State1')).to.be.null;
    const state1 = sidebar.getStateByName(model, 'State1_');
    const state2 = sidebar.getStateByName(model, 'State2');

    expect(state2.State.events.indexOf('TestStateChange')).to.equal(-1);
    expect(state2.State.events.indexOf('TestStateChange_')).to.be.least(0);
    expect(state1.State.immediateActions.indexOf('TestTransition')).to.equal(
      -1,
    );
    expect(
      state1.State.immediateActions.indexOf('TestTransition_'),
    ).to.be.least(0);
    expect(state2.State.eventActions[0].actions[0]).to.equal('Goto_Action3');
    expect(state1.State.diagramName).to.equal('Main_');
  });

  it('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.statesReferencing(model, 'TestStateChange', 'Event', true);
    sidebar.statesReferencing(model, 'TestTransition', 'Action', true);
    sidebar.statesReferencing(model, 'Goto_Action2', 'Action', true);
    sidebar.statesReferencing(model, 'Main', 'Diagram', true);
    sidebar.statesReferencing(model, 'State1', 'State', true);

    const state1 = sidebar.getStateByName(model, 'State1');
    const state2 = sidebar.getStateByName(model, 'State2');

    expect(state2.State.events.indexOf('TestStateChange')).to.equal(-1);
    expect(state1.State.immediateActions.indexOf('TestTransition')).to.equal(
      -1,
    );
    expect(state2.State.eventActions[0].actions.length).to.equal(0);
    expect(state1.State.diagramName).to.equal('');
  });
});

describe('diagramsReferencing', () => {
  it('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.diagramsReferencing(model, 'State1', 'State')),
    ).to.have.members(['Main']);
    expect(
      names(sidebar.diagramsReferencing(model, 'Main', 'Diagram')),
    ).to.have.members(['Main']);
    expect(
      sidebar.diagramsReferencing(model, 'TestTransition', 'Action').length,
    ).to.equal(0);
    expect(
      sidebar.diagramsReferencing(model, 'TestTimer', 'Event').length,
    ).to.equal(0);
    expect(
      sidebar.diagramsReferencing(model, 'ExtSim1', 'ExtSim').length,
    ).to.equal(0);
    expect(
      sidebar.diagramsReferencing(model, 'Int_', 'Variable').length,
    ).to.equal(0);
    expect(
      sidebar.diagramsReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).to.equal(0);
  });

  it('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.diagramsReferencing(model, 'State1', 'State', false, 'State1_');
    sidebar.diagramsReferencing(model, 'Main', 'Diagram', false, 'Main_');

    expect(sidebar.getDiagramByName(model, 'Main')).to.be.null;
    const main = sidebar.getDiagramByName(model, 'Main_');

    expect(main.Diagram.states.indexOf('State1')).to.equal(-1);
    expect(main.Diagram.states.indexOf('State1_')).to.be.least(0);
  });

  it('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.diagramsReferencing(model, 'State1', 'State', true);

    const main = sidebar.getDiagramByName(model, 'Main');

    expect(main.Diagram.states.indexOf('State1')).to.equal(-1);
  });
});

describe('logicNodesReferencing', () => {
  it('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      names(sidebar.logicNodesReferencing(model, 'Component', 'Diagram')),
    ).to.have.members(['LogicTree1']);
    expect(
      names(sidebar.logicNodesReferencing(model, 'gate_2', 'LogicTree')),
    ).to.have.members(['LogicTree1']);
    expect(
      names(sidebar.logicNodesReferencing(model, 'LogicTree1', 'LogicTree')),
    ).to.have.members(['LogicTree1', 'gate_2']);
    expect(
      sidebar.logicNodesReferencing(model, 'TestTransition', 'Action').length,
    ).to.equal(0);
    expect(
      sidebar.logicNodesReferencing(model, 'TestTimer', 'Event').length,
    ).to.equal(0);
    expect(
      sidebar.logicNodesReferencing(model, 'ExtSim1', 'ExtSim').length,
    ).to.equal(0);
    expect(
      sidebar.logicNodesReferencing(model, 'Int_', 'Variable').length,
    ).to.equal(0);
    expect(
      sidebar.logicNodesReferencing(model, 'State1', 'State').length,
    ).to.equal(0);
  });

  it('renaming refs', async () => {
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

    expect(sidebar.getLogicNodeByName(model, 'LogicTree1')).to.be.null;
    const logicTree1 = sidebar.getLogicNodeByName(model, 'LogicTree1_');

    expect(logicTree1.LogicNode.compChildren).to.have.members(['Component_']);
    expect(logicTree1.LogicNode.gateChildren).to.have.members(['gate__2']);
  });

  it('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.logicNodesReferencing(model, 'Component', 'Diagram', true);
    sidebar.logicNodesReferencing(model, 'gate_2', 'LogicTree', true);

    const logicTree1 = sidebar.getLogicNodeByName(model, 'LogicTree1');

    expect(logicTree1.LogicNode.compChildren.length).to.equal(0);
    expect(logicTree1.LogicNode.gateChildren.length).to.equal(0);

    const model2 = await readTestData('TestProject');

    sidebar.logicNodesReferencing(model2, 'LogicTree1', 'LogicTree', true);

    const gate2 = sidebar.getLogicNodeByName(model2, 'gate_2');

    expect(gate2.LogicNode.rootName).to.equal('');
  });
});

describe('variableReferencing', () => {
  it('gettings refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      sidebar.variableReferencing(model, 'Main', 'Diagram').length,
    ).to.equal(0);
    expect(
      sidebar.variableReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).to.equal(0);
    expect(
      sidebar.variableReferencing(model, 'TestTransition', 'Action').length,
    ).to.equal(0);
    expect(
      sidebar.variableReferencing(model, 'TestTimer', 'Event').length,
    ).to.equal(0);
    expect(
      sidebar.variableReferencing(model, 'ExtSim1', 'ExtSim').length,
    ).to.equal(0);
    expect(
      names(sidebar.variableReferencing(model, 'Int_', 'Variable')),
    ).to.have.members(['Int_']);
    expect(
      names(sidebar.variableReferencing(model, 'State3', 'State')),
    ).to.have.members(['TestAccrual']);
  });

  it('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.variableReferencing(
      model,
      'TestAccrual',
      'Variable',
      false,
      'TestAccrual_',
    );
    sidebar.variableReferencing(model, 'State3', 'State', false, 'State3_');

    expect(sidebar.getVariableByName(model, 'TestAcrrual')).to.be.null;
    const testAccrual = sidebar.getVariableByName(model, 'TestAccrual_');

    expect(testAccrual.Variable.accrualStatesData[0].stateName).to.equal(
      'State3_',
    );
  });

  it('deleting refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.variableReferencing(model, 'State3', 'State', true);

    const testAccrual = sidebar.getVariableByName(model, 'TestAccrual');

    expect(testAccrual.Variable.accrualStatesData.length).to.equal(0);
  });
});

describe('extSimsReferencing', () => {
  it('getting refs', async () => {
    const model = await readTestData('TestProject');

    expect(
      sidebar.extSimsReferencing(model, 'Main', 'Diagram').length,
    ).to.equal(0);
    expect(
      sidebar.extSimsReferencing(model, 'LogicTree1', 'LogicTree').length,
    ).to.equal(0);
    expect(
      sidebar.extSimsReferencing(model, 'TestTransition', 'Action').length,
    ).to.equal(0);
    expect(
      sidebar.extSimsReferencing(model, 'TestTimer', 'Event').length,
    ).to.equal(0);
    expect(
      sidebar.extSimsReferencing(model, 'Int_', 'Variable').length,
    ).to.equal(0);
    expect(
      names(sidebar.extSimsReferencing(model, 'ExtSim1', 'ExtSim')),
    ).to.have.members(['ExtSim1']);
    expect(
      sidebar.extSimsReferencing(model, 'State1', 'State').length,
    ).to.equal(0);
  });

  it('renaming refs', async () => {
    const model = await readTestData('TestProject');

    sidebar.extSimsReferencing(model, 'ExtSim1', 'ExtSim', false, 'ExtSim1_');

    expect(sidebar.getExtSimByName(model, 'ExtSim1')).to.be.null;
    expect(sidebar.getExtSimByName(model, 'ExtSim1_')).not.to.be.null;
  });
});

describe('exportDiagramTest', () => {
  it('exports the diagram', async () => {
    const model = await readTestData('ExportDiagramTest');

    const exported = sidebar.exportDiagram(
      model.DiagramList.find((d) => d.Diagram.name === 'TemplateDiagram')
        .Diagram,
      model,
    );

    expect(exported.StateList.length).to.equal(1);
    expect(exported.StateList[0].State.name).to.equal('State3');
    expect(exported.EventList.length).to.equal(1);
    expect(exported.EventList[0].Event.name).to.equal('new event');
    expect(exported.LogicNodeList.length).to.equal(1);
    expect(exported.LogicNodeList[0].LogicNode.name).to.equal('LogicTree1');
    expect(exported.DiagramList.length).to.equal(2);
    expect(exported.DiagramList.map((d) => d.Diagram.name)).to.have.members([
      'LogicComponent',
      'TemplateDiagram',
    ]);
  });
});
