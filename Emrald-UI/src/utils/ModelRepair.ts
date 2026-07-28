import type {
  EMRALD_Model,
  EventActionItems,
  MainItemType,
} from '../types/EMRALD_Model';

type NamedItem = {
  name?: string;
};

export function hasUsableName(name: unknown): name is string {
  return typeof name === 'string' && name.trim().length > 0;
}

function getNameSet(items: NamedItem[]) {
  return new Set(
    items
      .map(item => item.name)
      .filter((name): name is string => hasUsableName(name)),
  );
}

function cleanReferenceList(
  references: string[] | undefined,
  validNames: Set<string>,
) {
  const cleaned: string[] = [];
  const seen = new Set<string>();

  for (const reference of references ?? []) {
    if (
      !hasUsableName(reference)
      || !validNames.has(reference)
      || seen.has(reference)
    ) {
      continue;
    }

    cleaned.push(reference);
    seen.add(reference);
  }

  return cleaned;
}

function cleanScalarReference(reference: unknown, validNames: Set<string>) {
  return hasUsableName(reference) && validNames.has(reference) ? reference : '';
}

function cleanEventAction(
  eventAction: EventActionItems | undefined,
  actionNames: Set<string>,
): EventActionItems {
  return {
    actions: cleanReferenceList(eventAction?.actions, actionNames),
    moveFromCurrent: eventAction?.moveFromCurrent ?? false,
  };
}

function removeItemsWithMissingNames(model: EMRALD_Model) {
  model.DiagramList = model.DiagramList.filter(diagram =>
    hasUsableName(diagram.name),
  );
  model.StateList = model.StateList.filter(state =>
    hasUsableName(state.name),
  );
  model.ActionList = model.ActionList.filter(action =>
    hasUsableName(action.name),
  );
  model.EventList = model.EventList.filter(event =>
    hasUsableName(event.name),
  );
  model.ExtSimList = model.ExtSimList.filter(extSim =>
    hasUsableName(extSim.name),
  );
  model.LogicNodeList = model.LogicNodeList.filter(logicNode =>
    hasUsableName(logicNode.name),
  );
  model.VariableList = model.VariableList.filter(variable =>
    hasUsableName(variable.name),
  );
}

function repairDiagramStateLists(model: EMRALD_Model) {
  const diagramNames = getNameSet(model.DiagramList);
  const stateByName = new Map(
    model.StateList.map(state => [state.name, state]),
  );

  for (const diagram of model.DiagramList) {
    const repairedStates: string[] = [];
    const seen = new Set<string>();

    for (const stateName of diagram.states) {
      const state = stateByName.get(stateName);
      if (!state || seen.has(stateName)) {
        continue;
      }

      if (!hasUsableName(state.diagramName) || !diagramNames.has(state.diagramName)) {
        state.diagramName = diagram.name;
      }

      if (state.diagramName === diagram.name) {
        repairedStates.push(stateName);
        seen.add(stateName);
      }
    }

    diagram.states = repairedStates;
  }
}

function repairStateReferences(model: EMRALD_Model) {
  const actionNames = getNameSet(model.ActionList);
  const diagramNames = getNameSet(model.DiagramList);
  const eventNames = getNameSet(model.EventList);

  for (const state of model.StateList) {
    state.diagramName = cleanScalarReference(state.diagramName, diagramNames);
    state.immediateActions = cleanReferenceList(
      state.immediateActions,
      actionNames,
    );

    const repairedEvents: string[] = [];
    const repairedEventActions: EventActionItems[] = [];

    for (const [index, eventName] of state.events.entries()) {
      if (!hasUsableName(eventName) || !eventNames.has(eventName)) {
        continue;
      }

      repairedEvents.push(eventName);
      repairedEventActions.push(
        cleanEventAction(state.eventActions[index], actionNames),
      );
    }

    state.events = repairedEvents;
    state.eventActions = repairedEventActions;
  }
}

function repairActionReferences(model: EMRALD_Model) {
  const extSimNames = getNameSet(model.ExtSimList);
  const stateNames = getNameSet(model.StateList);
  const variableNames = getNameSet(model.VariableList);

  for (const action of model.ActionList) {
    if (action.extSim != null) {
      action.extSim = cleanScalarReference(action.extSim, extSimNames);
    }
    if (action.variableName != null) {
      action.variableName = cleanScalarReference(action.variableName, variableNames);
    }
    if (action.codeVariables != null) {
      action.codeVariables = cleanReferenceList(action.codeVariables, variableNames);
    }
    if (action.newStates != null) {
      action.newStates = action.newStates
        .filter(newState => stateNames.has(newState.toState))
        .map(newState => ({
          ...newState,
          varProb:
            newState.varProb != null && variableNames.has(newState.varProb)
              ? newState.varProb
              : null,
        }));
    }
  }
}

function repairEventReferences(model: EMRALD_Model) {
  const logicNodeNames = getNameSet(model.LogicNodeList);
  const stateNames = getNameSet(model.StateList);
  const variableNames = getNameSet(model.VariableList);

  for (const event of model.EventList) {
    if (event.triggerStates != null) {
      event.triggerStates = cleanReferenceList(event.triggerStates, stateNames);
    }
    if (event.varNames != null) {
      event.varNames = cleanReferenceList(event.varNames, variableNames);
    }
    if (event.logicTop != null) {
      event.logicTop = cleanScalarReference(event.logicTop, logicNodeNames);
    }
    if (event.variable != null) {
      event.variable = cleanScalarReference(event.variable, variableNames);
    }
    if (event.useVariable === true && event.time != null) {
      event.time = cleanScalarReference(event.time, variableNames);
    }
    if (
      event.useVariable === true
      && typeof event.lambda === 'string'
      && !variableNames.has(event.lambda)
    ) {
      event.lambda = '';
    }
    if (event.parameters != null) {
      event.parameters = event.parameters.map(parameter => {
        if (parameter.variable == null) {
          return parameter;
        }

        return {
          ...parameter,
          variable: cleanScalarReference(parameter.variable, variableNames),
        };
      });
    }
  }
}

function repairLogicNodeReferences(model: EMRALD_Model) {
  const diagramNames = getNameSet(model.DiagramList);
  const logicNodeNames = getNameSet(model.LogicNodeList);
  const stateNames = getNameSet(model.StateList);

  for (const logicNode of model.LogicNodeList) {
    logicNode.gateChildren = cleanReferenceList(
      logicNode.gateChildren,
      logicNodeNames,
    );
    logicNode.compChildren = logicNode.compChildren
      .filter(child => diagramNames.has(child.diagramName))
      .map(child => ({
        ...child,
        stateValues: child.stateValues?.filter(stateValue =>
          stateNames.has(stateValue.stateName),
        ),
      }));
  }
}

function repairVariableReferences(model: EMRALD_Model) {
  const extSimNames = getNameSet(model.ExtSimList);
  const stateNames = getNameSet(model.StateList);

  for (const variable of model.VariableList) {
    if (variable.extSim != null) {
      variable.extSim = cleanScalarReference(variable.extSim, extSimNames);
    }
    if (variable.accrualStatesData != null) {
      variable.accrualStatesData = variable.accrualStatesData.filter(data =>
        stateNames.has(data.stateName),
      );
    }
  }
}

export function repairModelReferences(model: EMRALD_Model): EMRALD_Model {
  const repairedModel = structuredClone(model);

  removeItemsWithMissingNames(repairedModel);
  repairDiagramStateLists(repairedModel);
  repairStateReferences(repairedModel);
  repairActionReferences(repairedModel);
  repairEventReferences(repairedModel);
  repairLogicNodeReferences(repairedModel);
  repairVariableReferences(repairedModel);

  if (repairedModel.templates) {
    repairedModel.templates = repairedModel.templates.map(template =>
      repairModelReferences(template),
    );
  }

  return repairedModel;
}

export function getItemsWithEmptyNames(model: EMRALD_Model) {
  const emptyNameItems: {
    itemType: MainItemType;
    listName: string;
    index: number;
  }[] = [];
  const itemLists: [MainItemType, string, NamedItem[]][] = [
    ['Diagram', 'DiagramList', model.DiagramList],
    ['State', 'StateList', model.StateList],
    ['Action', 'ActionList', model.ActionList],
    ['Event', 'EventList', model.EventList],
    ['ExtSim', 'ExtSimList', model.ExtSimList],
    ['LogicNode', 'LogicNodeList', model.LogicNodeList],
    ['Variable', 'VariableList', model.VariableList],
  ];

  for (const [itemType, listName, items] of itemLists) {
    for (const [index, item] of items.entries()) {
      if (!hasUsableName(item.name)) {
        emptyNameItems.push({ itemType, listName, index });
      }
    }
  }

  for (const template of model.templates ?? []) {
    emptyNameItems.push(...getItemsWithEmptyNames(template));
  }

  return emptyNameItems;
}
