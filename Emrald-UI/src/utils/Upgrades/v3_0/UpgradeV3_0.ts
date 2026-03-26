/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DiagramType as DiagramTypeV2_4,
  EMRALD_Model as EMRALD_ModelV2_4,
  Group as GroupV2_4,
} from '../v2_4/AllModelInterfacesV2_4';
import type {
  EMRALD_Model,
  GeometryInfo,
  Group,
  StateEvalValue,
} from './AllModelInterfacesV3_0';

export function UpgradeV3_0(modelTxt: string) {
  return {
    newModel: JSON.stringify(
      UpgradeV3_0_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV2_4),
    ),
    errors: [],
  };
}

function UpgradeV3_0_Recursive(oldModel: EMRALD_ModelV2_4) {
  // do upgrade steps for version change 2.4 to 3.0
  // remove the extra layer between all the lists so we dont have items like - "EventList" : { "Event": {...}, "Event": {...}}
  const newModel: EMRALD_Model = {
    ...oldModel,
    id: oldModel.id === undefined ? undefined : String(oldModel.id),
    objType: 'EMRALD_Model',
    DiagramList: oldModel.DiagramList.map(({ Diagram }) => {
      const { diagramList, forceMerge, singleStates, id, ...rest } = Diagram; // exclude diagramList, forceMerge, singleStates
      return {
        ...rest, // Spread the rest of the properties
        id: id === undefined ? undefined : String(id),
        objType: 'Diagram',
        diagramType: mapDiagramType(Diagram.diagramType), // Add the mapped diagramType
        required: false,
      };
    }),
    ExtSimList: oldModel.ExtSimList.map(({ ExtSim }) => {
      const {
        modelRef,
        states,
        configData,
        simMaxTime,
        varScope,
        value,
        resetOnRuns,
        type,
        sim3DId,
        id,
        ...rest
      } = ExtSim; // exclude
      return {
        ...rest,
        objType: 'ExtSim',
        id: id === undefined ? undefined : String(id),
      };
    }),
    // StateList: oldModel.StateList ? oldModel.StateList.map(({ State }) => ({ ...State })) : [],
    StateList: oldModel.StateList.map(({ State }) => {
      const correctedString = State.geometry
        .replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":') // Replace property names with double quotes
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      const geometryInfo = JSON.parse(correctedString) as GeometryInfo;
      const { geometry, id, ...rest } = State; // exclude geometry
      return {
        ...rest,
        id: id === undefined ? undefined : String(id),
        objType: 'State',
        geometryInfo,
      };
    }),
    ActionList: oldModel.ActionList.map(({ Action }) => {
      const { itemId, moveFromCurrent, id, ...rest } = Action; // exclude itemId and move from current
      const mainItem: boolean = Action.mainItem ?? false;
      return {
        ...rest,
        id: id === undefined ? undefined : String(id),
        objType: 'Action',
        mainItem,
      };
    }),
    EventList: oldModel.EventList.map(({ Event }) => {
      const { id, ...rest } = Event;
      const ifInState
        = Event.ifInState == null
          ? undefined
          : typeof Event.ifInState === 'string'
            ? Event.ifInState.toUpperCase() === 'TRUE'
            : Event.ifInState;
      return {
        ...rest,
        id: id === undefined ? undefined : String(id),
        objType: 'Event',
        ifInState,
      };
    }),
    LogicNodeList: oldModel.LogicNodeList.map(({ LogicNode }) => ({
      ...LogicNode,
      id: LogicNode.id === undefined ? undefined : String(LogicNode.id),
      objType: 'LogicNode',
      isRoot:
        LogicNode.isRoot === undefined
          ? LogicNode.rootName == undefined
            ? false
            : LogicNode.rootName === LogicNode.name
          : LogicNode.isRoot
            || (LogicNode.rootName != undefined
              && LogicNode.rootName === LogicNode.name),
      compChildren: mapLogicNode(LogicNode.compChildren),
    })),
    VariableList: oldModel.VariableList.map(({ Variable }) => {
      // Destructure Variable, excluding modelRef, states, configData, and simMaxTime
      const {
        modelRef = null,
        states,
        configData,
        simMaxTime,
        $$hashKey,
        id,
        ...rest
      } = Variable;

      let regExpLine: number | undefined = undefined;
      if (Variable.regExpLine !== undefined) {
        regExpLine
          = typeof Variable.regExpLine === 'string'
            ? Number.parseFloat(Variable.regExpLine)
            : Variable.regExpLine;
      }

      let begPosition: number | undefined = undefined;
      if (Variable.begPosition !== undefined) {
        begPosition
          = typeof Variable.begPosition === 'string'
            ? Number.parseFloat(Variable.begPosition)
            : Variable.begPosition;
      }

      // Map accrualStatesData if it's defined
      const accrualStatesData
        = Variable.accrualStatesData === undefined
          ? undefined
          : Variable.accrualStatesData.map(AccrualState => {
              // Destructure AccrualState, excluding $$hashKey
              const { $$hashKey, ...rest } = AccrualState;
              return rest;
            });

      return {
        ...rest, // Spread the rest of the properties
        id: id === undefined ? undefined : String(id),
        objType: 'Variable',
        accrualStatesData, // Include mapped accrualStatesData
        regExpLine,
        begPosition,
      };
    }),
    group: oldModel.group ? convertGroupV2_4ToGroup(oldModel.group) : undefined,
    templates: convertTemplates(oldModel.templates as EMRALD_ModelV2_4[]),
  };

  // function to map changed diagram type
  function mapLogicNode(childNames?: string[]) {
    // move the child name to the diagramName and create an empty stateValues array.
    return childNames
      ? childNames.map(child => ({ diagramName: child, stateValues: [] }))
      : [];
  }

  // function to map changed diagram type
  function mapDiagramType(diagramType: DiagramTypeV2_4) {
    switch (diagramType) {
      case 'dtComponent':
      case 'dtSystem': {
        return 'dtSingle';
      }
      default: {
        return 'dtMulti';
      }
    }
  }

  function convertTemplates(templates?: EMRALD_ModelV2_4[]) {
    if (!templates) {
      return undefined;
    }
    return templates.map(element => UpgradeV3_0_Recursive(element));
  }

  function convertGroupV2_4ToGroup(groupV2_4?: GroupV2_4): Group | undefined {
    if (!groupV2_4) {
      return undefined; // If input is null, return null
    }

    const { name, subgroup } = groupV2_4;

    // Recursively convert subgroup if it exists
    const convertedSubgroups = [];
    if (subgroup) {
      for (const s of subgroup) {
        const converted = convertGroupV2_4ToGroup(s);
        if (converted) {
          convertedSubgroups.push(converted);
        }
      }
    }

    return {
      name,
      subgroup: convertedSubgroups.length > 0 ? convertedSubgroups : undefined,
    };
  }

  const stateValDict = new Map<string, StateEvalValue>(); // values for states
  const singleDiagrams = new Set<string>();
  for (const diagram of oldModel.DiagramList.map(({ Diagram }) => ({
    ...Diagram,
  }))) {
    // find all the state values for diagrams that are single state diagrams
    if (diagram.singleStates !== undefined) {
      for (const value of diagram.singleStates) {
        stateValDict.set(
          value.stateName,
          value.okState === 'True' ? 'True' : 'False',
        );
      }

      singleDiagrams.add(diagram.name);
    }
  }

  for (const state of newModel.StateList) {
    if (singleDiagrams.has(state.diagramName)) {
      state.defaultSingleStateValue = stateValDict.has(state.name)
        ? stateValDict.get(state.name)
        : 'Ignore';
    }
  }

  newModel.emraldVersion = 3;
  newModel.version = 1; // set user version for first use of this property
  return newModel;
}
