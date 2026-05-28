'use strict';

const EMRALD_SchemaVersion = 3.3;

function UpgradeV1_x(modelTxt) {
    const newModel = JSON.parse(modelTxt);
    if (newModel.version == undefined || newModel.version <= 1.2) {
        // newModel.ActionList.forEach((a : { Action: { mainItem?: string, mutExcl?: string } }) => {
        //   a.Action.mainItem = !!(a.Action.mainItem !== undefined) ? (a.Action.mainItem.toUpperCase() === "TRUE") : false;
        //   a.Action.mutExcl = !!(a.Action.mutExcl !== undefined) ? (a.Action.mutExcl.toUpperCase() === "TRUE") : false;
        // });
        // newModel.ActionList.forEach((a: { Action: { mainItem?: string | boolean, mutExcl?: string | boolean } }) => {
        //   a.Action.mainItem = !!a.Action.mainItem && a.Action.mainItem.toUpperCase() === "TRUE";
        //   a.Action.mutExcl = !!a.Action.mutExcl && a.Action.mutExcl.toUpperCase() === "TRUE";
        // });
        if (newModel.ActionList != undefined) {
            for (const a of newModel.ActionList) {
                const action = a.Action;
                action.mainItem ?? (action.mainItem = false);
                if (typeof action.mainItem === 'string') {
                    action.mainItem = action.mainItem.toUpperCase() === 'TRUE';
                }
                if (typeof action.mutExcl === 'string') {
                    action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
                }
                delete action.simEndtime;
            }
        }
        if (newModel.EventList != undefined) {
            for (const e of newModel.EventList) {
                const event = e.Event;
                event.mainItem ?? (event.mainItem = false);
                if (typeof event.mainItem === 'string') {
                    event.mainItem = event.mainItem.toUpperCase() === 'TRUE';
                }
                if (typeof event.allItems === 'string') {
                    event.allItems = event.allItems.toUpperCase() === 'TRUE';
                }
                if (typeof event.onSuccess === 'string') {
                    event.onSuccess = event.onSuccess.toUpperCase() === 'TRUE';
                }
                // Check if the `Code` property exists and delete it
                delete event.Code;
                delete event.sim3dID;
                delete event.tempLogicTopList;
                delete event.tempVariableList;
                delete event.missionTime;
                delete event.evtType;
                event.mean = event.ndMean;
                delete event.ndMean;
                event.std = event.ndStdDev;
                delete event.ndStdDev;
                event.min = event.ndMin;
                delete event.ndMin;
                event.max = event.ndMax;
                delete event.ndMax;
            }
        }
    }
    newModel.version = 1.2;
    return { newModel: JSON.stringify(newModel), errors: [] };
}

function UpgradeV2_4(modelTxt) {
    // first fix random issues that don't match the schema, extra parameters that didn't get removed in a version upgrade
    const oldModel = JSON.parse(modelTxt);
    const newModel = {
        ...oldModel,
        ActionList: oldModel.ActionList.map(a => {
            const action = a.Action;
            if (typeof action.mutExcl === 'string') {
                action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
            }
            delete action.required;
            return { Action: action };
        }),
        DiagramList: oldModel.DiagramList.map(d => {
            const diagram = d.Diagram;
            delete diagram.required;
            delete diagram.diagramLabels;
            return { Diagram: diagram };
        }),
        StateList: oldModel.StateList.map(s => {
            const state = s.State;
            delete state.required;
            return { State: state };
        }),
        VariableList: oldModel.VariableList.map(v => {
            const variable = v.Variable;
            delete variable.required;
            return { Variable: variable };
        }),
        EventList: oldModel.EventList.map(e => {
            const event = e.Event;
            delete event.missionTime;
            event.mainItem ?? (event.mainItem = false);
            if (event.evtType !== undefined) {
                event.evType ?? (event.evType = event.evtType);
                delete event.evtType;
            }
            if (event.stdv !== undefined) {
                event.std ?? (event.std = event.stdv);
                delete event.stdv;
            }
            delete event.Code;
            delete event.sim3dID;
            delete event.ndMean;
            delete event.ndStdDev;
            delete event.ndMin;
            delete event.ndMax;
            delete event.evalCurOnInitial;
            delete event.required;
            return { Event: mapEvent(event) };
        }),
        ExtSimList: oldModel.ExtSimList ?? [],
    };
    function mapEvent(oldEv) {
        const allItems = oldEv.allItems == null
            ? undefined
            : typeof oldEv.allItems === 'string'
                ? oldEv.allItems.toUpperCase() === 'TRUE'
                : oldEv.allItems;
        const onSuccess = oldEv.onSuccess == null
            ? undefined
            : typeof oldEv.onSuccess === 'string'
                ? oldEv.onSuccess.toUpperCase() === 'TRUE'
                : oldEv.onSuccess;
        const ifInState = oldEv.ifInState == null
            ? undefined
            : typeof oldEv.ifInState === 'string'
                ? oldEv.ifInState.toUpperCase() === 'TRUE'
                : oldEv.ifInState;
        if (oldEv.evType
            && [
                'etNormalDist',
                'etLogNormalDist',
                'etExponentialDist',
                'etWeibullDist',
            ].includes(oldEv.evType)) {
            const removedOldEv = oldEv;
            const { moveFromCurrent, rate, timeRate, mean, std, min, max, meanTimeRate, stdTimeRate, minTimeRate, maxTimeRate, ...rest } = removedOldEv;
            const evType = 'etDistribution';
            let distType = 'dtNormal';
            switch (oldEv.evType) {
                case 'etNormalDist': {
                    distType = 'dtNormal';
                    break;
                }
                case 'etLogNormalDist': {
                    distType = 'dtLogNormal';
                    break;
                }
                case 'etExponentialDist': {
                    distType = 'dtExponential';
                    break;
                }
                case 'etWeibullDist': {
                    distType = 'dtWeibull';
                    break;
                }
            }
            const updatedEv = {
                ...rest,
                evType,
                distType,
                allItems,
                onSuccess,
                ifInState,
                mainItem: rest.mainItem ?? true,
            };
            switch (oldEv.evType) {
                case 'etNormalDist':
                case 'etLogNormalDist': {
                    updatedEv.parameters = [
                        {
                            name: 'Mean',
                            timeRate: oldEv.meanTimeRate,
                            useVariable: false,
                            value: oldEv.mean,
                        },
                        {
                            name: 'Standard Deviation',
                            timeRate: oldEv.stdTimeRate,
                            useVariable: false,
                            value: oldEv.std,
                        },
                        {
                            name: 'Minimum',
                            timeRate: oldEv.minTimeRate,
                            useVariable: false,
                            value: oldEv.min,
                        },
                        {
                            name: 'Maximum',
                            timeRate: oldEv.maxTimeRate,
                            useVariable: false,
                            value: oldEv.max,
                        },
                    ];
                    updatedEv.dfltTimeRate = 'trHours';
                    break;
                }
                case 'etExponentialDist': {
                    updatedEv.parameters = [
                        {
                            name: 'Rate',
                            timeRate: oldEv.timeRate,
                            useVariable: false,
                            value: oldEv.rate,
                        },
                        {
                            name: 'Minimum',
                            timeRate: 'trHours',
                            useVariable: false,
                            value: 0,
                        },
                        {
                            name: 'Maximum',
                            timeRate: 'trYears',
                            useVariable: false,
                            value: 1000,
                        },
                    ];
                    updatedEv.dfltTimeRate = 'trHours';
                    break;
                }
                case 'etWeibullDist': {
                    updatedEv.parameters = [
                        {
                            name: 'Shape',
                            useVariable: false,
                            value: oldEv.shape,
                        },
                        {
                            name: 'Scale',
                            timeRate: oldEv.timeRate,
                            useVariable: false,
                            value: oldEv.scale,
                        },
                        {
                            name: 'Minimum',
                            timeRate: 'trHours',
                            useVariable: false,
                            value: 0,
                        },
                        {
                            name: 'Maximum',
                            timeRate: 'trYears',
                            useVariable: false,
                            value: 1000,
                        },
                    ];
                    updatedEv.dfltTimeRate = oldEv.timeRate;
                    break;
                }
            }
            return updatedEv;
        }
        else {
            // no need to change it so just add it back to the ev list
            const { rate, timeRate, moveFromCurrent, mean, std, min, max, meanTimeRate, stdTimeRate, minTimeRate, maxTimeRate, ...rest } = oldEv;
            const evType = oldEv.evType;
            return {
                ...rest,
                evType,
                allItems,
                onSuccess,
                ifInState,
                mainItem: rest.mainItem ?? true,
            };
        }
    }
    newModel.version = 2.4;
    return {
        newModel: JSON.stringify(newModel),
        errors: [],
    };
}

function UpgradeV3_0(modelTxt) {
    return {
        newModel: JSON.stringify(UpgradeV3_0_Recursive(JSON.parse(modelTxt))),
        errors: [],
    };
}
function UpgradeV3_0_Recursive(oldModel) {
    // do upgrade steps for version change 2.4 to 3.0
    // remove the extra layer between all the lists so we dont have items like - "EventList" : { "Event": {...}, "Event": {...}}
    const newModel = {
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
            const { modelRef, states, configData, simMaxTime, varScope, value, resetOnRuns, type, sim3DId, id, ...rest } = ExtSim; // exclude
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
            const geometryInfo = JSON.parse(correctedString);
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
            const mainItem = Action.mainItem ?? false;
            return {
                ...rest,
                id: id === undefined ? undefined : String(id),
                objType: 'Action',
                mainItem,
            };
        }),
        EventList: oldModel.EventList.map(({ Event }) => {
            const { id, ...rest } = Event;
            const ifInState = Event.ifInState == null
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
            isRoot: LogicNode.isRoot === undefined
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
            const { modelRef = null, states, configData, simMaxTime, $$hashKey, id, ...rest } = Variable;
            let regExpLine = undefined;
            if (Variable.regExpLine !== undefined) {
                regExpLine
                    = typeof Variable.regExpLine === 'string'
                        ? Number.parseFloat(Variable.regExpLine)
                        : Variable.regExpLine;
            }
            let begPosition = undefined;
            if (Variable.begPosition !== undefined) {
                begPosition
                    = typeof Variable.begPosition === 'string'
                        ? Number.parseFloat(Variable.begPosition)
                        : Variable.begPosition;
            }
            // Map accrualStatesData if it's defined
            const accrualStatesData = Variable.accrualStatesData === undefined
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
        templates: convertTemplates(oldModel.templates),
    };
    // function to map changed diagram type
    function mapLogicNode(childNames) {
        // move the child name to the diagramName and create an empty stateValues array.
        return childNames
            ? childNames.map(child => ({ diagramName: child, stateValues: [] }))
            : [];
    }
    // function to map changed diagram type
    function mapDiagramType(diagramType) {
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
    function convertTemplates(templates) {
        if (!templates) {
            return undefined;
        }
        return templates.map(element => UpgradeV3_0_Recursive(element));
    }
    function convertGroupV2_4ToGroup(groupV2_4) {
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
    const stateValDict = new Map(); // values for states
    const singleDiagrams = new Set();
    for (const diagram of oldModel.DiagramList.map(({ Diagram }) => ({
        ...Diagram,
    }))) {
        // find all the state values for diagrams that are single state diagrams
        if (diagram.singleStates !== undefined) {
            for (const value of diagram.singleStates) {
                stateValDict.set(value.stateName, value.okState === 'True' ? 'True' : 'False');
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

function UpgradeV3_1(modelTxt) {
    return {
        newModel: JSON.stringify(UpgradeV3_1_Recursive(JSON.parse(modelTxt))),
        errors: [],
    };
}
function UpgradeV3_1_Recursive(oldModel) {
    // Note: The reassignment of the objType properties here is just to make TypeScript happy
    const upgradeModel = (oldModel) => ({
        ...oldModel,
        DiagramList: oldModel.DiagramList.map(diagram => {
            const newDiagram = {
                ...diagram,
                objType: 'Diagram',
            };
            return newDiagram;
        }),
        ExtSimList: oldModel.ExtSimList.map(extsim => {
            const newExtSim = {
                ...extsim,
                objType: 'ExtSim',
            };
            return newExtSim;
        }),
        StateList: oldModel.StateList.map(state => {
            const newState = {
                ...state,
                objType: 'State',
            };
            return newState;
        }),
        ActionList: oldModel.ActionList.map(action => {
            const newAction = {
                ...action,
                objType: 'Action',
                // Forces the required caType property to exist
                // For this update, the only possible value is the MAAP form
                formData: action.formData
                    ? {
                        ...action.formData,
                        sourceElements: [],
                        initiators: [],
                        parameters: [],
                        inputBlocks: [],
                        caType: 'MAAP',
                        needsUpgrade: true,
                    }
                    : undefined,
            };
            return newAction;
        }),
        EventList: oldModel.EventList.map(event => {
            const newEvent = {
                ...event,
                objType: 'Event',
            };
            return newEvent;
        }),
        LogicNodeList: oldModel.LogicNodeList.map(ln => {
            const newLn = {
                ...ln,
                objType: 'LogicNode',
            };
            return newLn;
        }),
        VariableList: oldModel.VariableList.map(v => {
            const newVar = {
                ...v,
                objType: 'Variable',
            };
            return newVar;
        }),
        versionHistory: [],
        emraldVersion: 3.1,
    });
    return {
        ...upgradeModel(oldModel),
        templates: oldModel.templates?.map(template => upgradeModel(template)),
    };
}

function UpgradeV3_2(modelTxt) {
    return {
        newModel: JSON.stringify(UpgradeV3_2_Recursive(JSON.parse(modelTxt))),
        errors: [],
    };
}
function UpgradeV3_2_Recursive(oldModel) {
    const upgradeModel = (oldModel) => ({
        ...oldModel,
        ActionList: oldModel.ActionList.map(action => ({
            ...action,
            formData: action.formData, // Differences in types are just superficial, so this casts them to get typescript to stop complaining
        })),
        StateList: oldModel.StateList.map(state => {
            let geometryInfo = state.geometryInfo;
            if (state.geometryInfo === undefined
                && typeof state.geometry === 'string') {
                geometryInfo = JSON.parse(state.geometry.replace(/([A-z]+):\s/g, '"$1": '));
            }
            return {
                ...state,
                geometryInfo,
            };
        }),
        emraldVersion: 3.2,
    });
    return {
        ...upgradeModel(oldModel),
        templates: oldModel.templates?.map(template => {
            return upgradeModel(template);
        }),
    };
}

function UpgradeV3_3(modelTxt) {
    return {
        newModel: JSON.stringify(UpgradeV3_3_Recursive(JSON.parse(modelTxt))),
        errors: [],
    };
}
function UpgradeV3_3_Recursive(oldModel) {
    // v3.2 -> v3.3 adds optional distribution fields to atCngVarVal actions
    // (useDistribution, distType, parameters, dfltTimeRate). Existing actions
    // without these fields default to using scriptCode, so no transformation
    // of existing data is needed.
    const upgradeModel = (oldModel) => ({
        ...oldModel,
        emraldVersion: 3.3,
    });
    return {
        ...upgradeModel(oldModel),
        templates: oldModel.templates?.map(template => upgradeModel(template)),
    };
}

class Upgrade {
    constructor(modelTxt) {
        this._emraldVersion = 0;
        this._oldModelTxt = modelTxt;
        let modelObj = null;
        this._newModelTxt = '';
        this._newModel = undefined;
        this._emraldVersion = 0;
        this._errors = [];
        if (modelTxt != '') {
            modelObj = JSON.parse(modelTxt);
            // using emraldVersion for now
            try {
                const m = modelObj;
                this._emraldVersion = m.emraldVersion ?? m.version ?? 0;
            }
            catch {
                this._errors.push('Invalid JSON format');
            }
        }
    }
    get newModel() {
        return this._newModel;
    }
    get newModelStr() {
        return JSON.stringify(this._newModel);
    }
    get errorsStr() {
        return this._errors;
    }
    upgradeGiveID(toVersion, setIdFunction) {
        this._newModelTxt = this._oldModelTxt;
        // Define upgrade functions
        const upgrades = [
            { emraldVersion: 1.2, upgradeFunction: UpgradeV1_x },
            { emraldVersion: 2.4, upgradeFunction: UpgradeV2_4 },
            { emraldVersion: 3, upgradeFunction: UpgradeV3_0 },
            { emraldVersion: 3.1, upgradeFunction: UpgradeV3_1 },
            { emraldVersion: 3.2, upgradeFunction: UpgradeV3_2 },
            { emraldVersion: 3.3, upgradeFunction: UpgradeV3_3 },
        ];
        // Apply upgrades
        for (const upgrade of upgrades) {
            if (this._emraldVersion < upgrade.emraldVersion
                && toVersion >= upgrade.emraldVersion) {
                const upgraded = upgrade.upgradeFunction(this._newModelTxt);
                this._newModelTxt = upgraded.newModel;
                this._newModel = JSON.parse(upgraded.newModel);
                if (upgraded.errors.length > 0) {
                    this._errors.push(`Invalid EMRALD model format v${upgrade.emraldVersion.toString()} - ${upgraded.errors.join(',')}`);
                    return false;
                }
                this._emraldVersion = upgrade.emraldVersion;
            }
        }
        if (!this.newModel) {
            this._newModel = JSON.parse(this._newModelTxt);
        }
        // Reset IDs if requested
        if (setIdFunction && this._newModel) {
            const lists = [
                this._newModel.ActionList,
                this._newModel.DiagramList,
                this._newModel.EventList,
                this._newModel.ExtSimList,
                this._newModel.LogicNodeList,
                this._newModel.StateList,
                this._newModel.VariableList,
            ];
            for (const list of lists) {
                for (const element of list) {
                    element.id = setIdFunction();
                }
            }
        }
        return true;
    }
}

function UpgradeEMRALDModel(modelTxt) {
    const runUpG = new Upgrade(modelTxt);
    runUpG.upgradeGiveID(EMRALD_SchemaVersion, undefined);
    return runUpG.newModelStr;
}

