'use strict';

function UpgradeV1_x(modelTxt) {
    var newModel = JSON.parse(modelTxt);
    if ((newModel.version == undefined) || (newModel.version <= 1.2)) {
        // newModel.ActionList.forEach((a : { Action: { mainItem?: string, mutExcl?: string } }) => {
        //   a.Action.mainItem = !!(a.Action.mainItem !== undefined) ? (a.Action.mainItem.toUpperCase() === "TRUE") : false;
        //   a.Action.mutExcl = !!(a.Action.mutExcl !== undefined) ? (a.Action.mutExcl.toUpperCase() === "TRUE") : false;
        // });
        // newModel.ActionList.forEach((a: { Action: { mainItem?: string | boolean, mutExcl?: string | boolean } }) => {
        //   a.Action.mainItem = !!a.Action.mainItem && a.Action.mainItem.toUpperCase() === "TRUE";
        //   a.Action.mutExcl = !!a.Action.mutExcl && a.Action.mutExcl.toUpperCase() === "TRUE";
        // });
        if (newModel.ActionList != undefined) {
            newModel.ActionList.forEach((a) => {
                const action = a.Action;
                if (action.mainItem === undefined)
                    action.mainItem = false;
                if (typeof action.mainItem === 'string') {
                    action.mainItem = action.mainItem.toUpperCase() === 'TRUE';
                }
                if (typeof action.mutExcl === 'string') {
                    action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
                }
                if (action.hasOwnProperty('simEndtime')) {
                    delete action.simEndtime;
                }
            });
        }
        if (newModel.EventList != undefined) {
            newModel.EventList.forEach((e) => {
                const event = e.Event;
                if (event.mainItem === undefined)
                    event.mainItem = false;
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
                if (event.hasOwnProperty('Code')) {
                    delete event.Code;
                }
                if (event.hasOwnProperty('sim3dID')) {
                    delete event.sim3dID;
                }
                if (event.hasOwnProperty('tempLogicTopList')) {
                    delete event.tempLogicTopList;
                }
                if (event.hasOwnProperty('tempVariableList')) {
                    delete event.tempVariableList;
                }
                if (event.hasOwnProperty('missionTime')) {
                    delete event.missionTime;
                }
                if (event.hasOwnProperty('evtType')) {
                    delete event.evtType;
                }
                // if (event.hasOwnProperty('shape')) {
                //   delete event.shape;
                // }
                // if (event.hasOwnProperty('scale')) {
                //   delete event.scale;
                // }
                if (event.hasOwnProperty('ndMean')) {
                    event.mean = event.ndMean;
                    delete event.ndMean;
                }
                if (event.hasOwnProperty('ndStdDev')) {
                    event.std = event.ndStdDev;
                    delete event.ndStdDev;
                }
                if (event.hasOwnProperty('ndMin')) {
                    event.min = event.ndMin;
                    delete event.ndMin;
                }
                if (event.hasOwnProperty('ndMax')) {
                    event.max = event.ndMax;
                    delete event.ndMax;
                }
            });
        }
    }
    newModel.version = 1.2;
    const retModel = { newModel: JSON.stringify(newModel), errors: [] };
    return retModel;
}

function UpgradeV2_4(modelTxt) {
    //first fix random issues that don't match the schema, extra parameters that didn't get removed in a version upgrade
    var tempModel = JSON.parse(modelTxt);
    if (tempModel.ActionList != undefined) {
        tempModel.ActionList.forEach((a) => {
            const action = a.Action;
            if (typeof action.mutExcl === 'string') {
                action.mutExcl = action.mutExcl.toUpperCase() === 'TRUE';
            }
            if (action.hasOwnProperty('required')) {
                delete action.required;
            }
        });
    }
    if (tempModel.DiagramList != undefined) {
        tempModel.DiagramList.forEach((d) => {
            const diagram = d.Diagram;
            if (diagram.hasOwnProperty('required')) {
                delete diagram.required;
            }
            if (diagram.hasOwnProperty('diagramLabels')) {
                delete diagram.diagramLabels;
            }
        });
    }
    if (tempModel.StateList != undefined) {
        tempModel.StateList.forEach((s) => {
            const state = s.State;
            if (state.hasOwnProperty('required')) {
                delete state.required;
            }
        });
    }
    if (tempModel.VariableList != undefined) {
        tempModel.VariableList.forEach((v) => {
            const variable = v.Variable;
            if (variable.hasOwnProperty('required')) {
                delete variable.required;
            }
        });
    }
    if (tempModel.EventList != undefined) {
        tempModel.EventList.forEach((e) => {
            const event = e.Event;
            if (event.hasOwnProperty('missionTime')) {
                delete event.missionTime;
            }
            if (event.mainItem === undefined)
                event.mainItem = false;
            if (event.hasOwnProperty('evtType')) {
                if (!event.hasOwnProperty('evtType'))
                    event.evType = event.evtType;
                delete event.evtType;
            }
            if (event.hasOwnProperty('stdv')) {
                if (!event.hasOwnProperty('stdev'))
                    event.std = event.stdv;
                delete event.stdv;
            }
            if (event.hasOwnProperty('Code')) {
                delete event.Code;
            }
            if (event.hasOwnProperty('sim3dID')) {
                delete event.sim3dID;
            }
            if (event.hasOwnProperty('ndMean')) {
                delete event.ndMean;
            }
            if (event.hasOwnProperty('ndStdDev')) {
                delete event.ndStdDev;
            }
            if (event.hasOwnProperty('ndMin')) {
                delete event.ndMin;
            }
            if (event.hasOwnProperty('ndMax')) {
                delete event.ndMax;
            }
            if (event.hasOwnProperty('evalCurOnInitial')) {
                delete event.evalCurOnInitial;
            }
            if (event.hasOwnProperty('required')) {
                delete event.required;
            }
        });
    }
    //Do schema update stuff
    var oldModel = JSON.parse(JSON.stringify(tempModel));
    //do upgrade steps for version change 1.2 to 2_4. Convert old distribution events
    const newModel = {
        ...oldModel,
        EventList: oldModel.EventList ? oldModel.EventList.map(({ Event }) => ({ Event: mapEvent(Event) })) : [],
        templates: undefined,
    };
    function mapEvent(oldEv) {
        var allItems = oldEv.allItems != null ?
            (typeof oldEv.allItems === 'string' ? oldEv.allItems.toUpperCase() === 'TRUE' : oldEv.allItems) :
            undefined;
        var onSuccess = oldEv.onSuccess != null ?
            (typeof oldEv.onSuccess === 'string' ? oldEv.onSuccess.toUpperCase() === 'TRUE' : oldEv.onSuccess) :
            undefined;
        var ifInState = oldEv.ifInState != null ?
            (typeof oldEv.ifInState === 'string' ? oldEv.ifInState.toUpperCase() === 'TRUE' : oldEv.ifInState) :
            undefined;
        if ([
            'etNormalDist',
            'etLogNormalDist',
            'etExponentialDist',
            'etWeibullDist',
        ].indexOf(oldEv.evType) > -1) {
            const removedOldEv = oldEv;
            const { moveFromCurrent, rate, timeRate, mean, std, min, max, meanTimeRate, stdTimeRate, minTimeRate, maxTimeRate, ...rest } = removedOldEv;
            const evType = 'etDistribution';
            var distType = 'dtNormal';
            switch (oldEv.evType) {
                case 'etNormalDist':
                    distType = 'dtNormal';
                    break;
                case "etLogNormalDist":
                    distType = 'dtLogNormal';
                    break;
                case 'etExponentialDist':
                    distType = 'dtExponential';
                    break;
                case 'etWeibullDist':
                    distType = 'dtWeibull';
                    break;
            }
            const updatedEv = {
                ...rest,
                evType,
                distType,
                allItems,
                onSuccess,
                ifInState
            };
            switch (oldEv.evType) {
                case 'etNormalDist':
                case 'etLogNormalDist':
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
                case 'etExponentialDist':
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
                case 'etWeibullDist':
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
            return updatedEv;
        }
        // else { // no need to change it so just add it back to the ev list
        //     return oldEv as Event;
        // }
        else { // no need to change it so just add it back to the ev list
            const { rate, timeRate, moveFromCurrent, mean, std, min, max, meanTimeRate, stdTimeRate, minTimeRate, maxTimeRate, ...rest } = oldEv;
            var evType = oldEv.evType;
            return {
                ...rest,
                evType,
                allItems,
                onSuccess,
                ifInState
            };
        }
    }
    newModel.version = 2.4;
    const retModel = { newModel: JSON.stringify(newModel), errors: [] };
    // //to validate the new version against the schema
    // const schemaPath = './src/Upgrades/v3_0/EMRALD_JsonSchemaV3_0.json';
    // const schemaTxt = fs.readFileSync(schemaPath, 'utf-8').trim();
    // const schema = JSON.parse(schemaTxt);
    // const validator = new Validator();
    // const validationResult = validator.validate(newModel, schema);
    // if(validationResult.valid === false){
    //     validationResult.errors.forEach(error => {
    //         retModel.errors.push(error.instance + " - " + error.message + " : " + JSON.stringify(error.argument))
    //     });
    // }
    return retModel;
}

function UpgradeV3_0(modelTxt) {
    //var m : EMRALD_ModelV2_4;
    var oldModel = JSON.parse(modelTxt);
    const newModel = UpgradeV3_0_Recursive(oldModel);
    const retModel = { newModel: JSON.stringify(newModel), errors: [] };
    return retModel;
}
function UpgradeV3_0_Recursive(oldModel) {
    //do upgrade steps for version change 2.4 to 3.0
    //remove the extra layer between all the lists so we dont have items like - "EventList" : { "Event": {...}, "Event": {...}}
    const newModel = {
        ...oldModel,
        id: oldModel.id !== undefined ? String(oldModel.id) : undefined,
        DiagramList: oldModel.DiagramList ? oldModel.DiagramList.map(({ Diagram }) => {
            const { diagramList, forceMerge, singleStates, id, ...rest } = Diagram; //exclude diagramList, forceMerge, singleStates
            return {
                ...rest, // Spread the rest of the properties
                id: id !== undefined ? String(id) : undefined,
                diagramType: mapDiagramType(Diagram.diagramType) // Add the mapped diagramType
            };
        }) : [],
        ExtSimList: oldModel.ExtSimList ? oldModel.ExtSimList.map(({ ExtSim }) => {
            const { modelRef, states, configData, simMaxTime, varScope, value, resetOnRuns, type, sim3DId, id, ...rest } = ExtSim; //exclude
            return {
                ...rest,
                id: id !== undefined ? String(id) : undefined,
            };
        }) : [],
        // StateList: oldModel.StateList ? oldModel.StateList.map(({ State }) => ({ ...State })) : [],
        StateList: oldModel.StateList ? oldModel.StateList.map(({ State }) => {
            const correctedString = State.geometry
                .replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":') // Replace property names with double quotes
                .replace(/'/g, '"'); // Replace single quotes with double quotes
            const parsedGeometry = JSON.parse(correctedString);
            var geometryInfo = parsedGeometry;
            const { geometry, id, ...rest } = State; //exclude geometry
            return {
                ...rest,
                id: id !== undefined ? String(id) : undefined,
                geometryInfo
            };
        }) : [],
        ActionList: oldModel.ActionList ? oldModel.ActionList.map(({ Action }) => {
            const { itemId, moveFromCurrent, id, ...rest } = Action; //exclude itemId and move from current
            var mainItem = Action.mainItem ? Action.mainItem : false;
            return {
                ...rest,
                id: id !== undefined ? String(id) : undefined,
                mainItem
            };
        }) : [],
        EventList: oldModel.EventList ? oldModel.EventList.map(({ Event }) => {
            const { id, ...rest } = Event;
            var ifInState = Event.ifInState != null ?
                (typeof Event.ifInState === 'string' ? Event.ifInState.toUpperCase() === 'TRUE' : Event.ifInState) :
                undefined;
            return {
                ...rest,
                id: id !== undefined ? String(id) : undefined,
                ifInState
            };
        }) : [],
        LogicNodeList: oldModel.LogicNodeList ? oldModel.LogicNodeList.map(({ LogicNode }) => ({
            ...LogicNode,
            id: LogicNode.id !== undefined ? String(LogicNode.id) : undefined,
            isRoot: LogicNode.isRoot !== undefined ? (LogicNode.isRoot || ((LogicNode.rootName != undefined) && (LogicNode.rootName === LogicNode.name))) :
                (LogicNode.rootName == undefined ? false : (LogicNode.rootName === LogicNode.name)),
            compChildren: mapLogicNode(LogicNode.compChildren)
        })) : [],
        VariableList: oldModel.VariableList ? oldModel.VariableList.map(({ Variable }) => {
            // Destructure Variable, excluding modelRef, states, configData, and simMaxTime
            const { modelRef = null, states, configData, simMaxTime, $$hashKey, id, ...rest } = Variable;
            var regExpLine = undefined;
            if (Variable.regExpLine !== undefined) {
                if (typeof Variable.regExpLine === 'string')
                    regExpLine = parseFloat(Variable.regExpLine);
                else
                    regExpLine = Variable.regExpLine;
            }
            var begPosition = undefined;
            if (Variable.begPosition !== undefined) {
                if (typeof Variable.begPosition === 'string')
                    begPosition = parseFloat(Variable.begPosition);
                else
                    begPosition = Variable.begPosition;
            }
            // Map accrualStatesData if it's defined
            const accrualStatesData = Variable.accrualStatesData === undefined ? undefined :
                Variable.accrualStatesData.map(AccrualState => {
                    // Destructure AccrualState, excluding $$hashKey
                    const { $$hashKey, ...rest } = AccrualState;
                    return rest;
                });
            return {
                ...rest, // Spread the rest of the properties
                id: id !== undefined ? String(id) : undefined,
                accrualStatesData, // Include mapped accrualStatesData
                regExpLine,
                begPosition
            };
        }) : [],
        group: oldModel.group ? convertGroupV2_4ToGroup(oldModel.group) : undefined,
        templates: convertTemplates(oldModel.templates)
    };
    //function to map changed diagram type
    function mapLogicNode(childNames) {
        //move the child name to the diagramName and create an empty stateValues array.
        return childNames ? childNames.map(child => ({ diagramName: child, stateValues: [] })) : [];
    }
    //function to map changed diagram type
    function mapDiagramType(diagramType) {
        switch (diagramType) {
            case "dtComponent":
            case "dtSystem":
                return "dtSingle";
            default:
                return "dtMulti";
        }
    }
    function convertTemplates(templates) {
        if (!templates)
            return undefined;
        const retModelArray = [];
        //convert each template to the new version
        templates.forEach(element => {
            retModelArray.push(UpgradeV3_0_Recursive(element));
        });
        return retModelArray;
    }
    function convertGroupV2_4ToGroup(groupV2_4) {
        if (!groupV2_4)
            return undefined; // If input is null, return null
        const { name, subgroup } = groupV2_4;
        // Recursively convert subgroup if it exists
        const convertedSubgroup = subgroup ? convertGroupV2_4ToGroup(subgroup) : undefined;
        return {
            name,
            subgroup: convertedSubgroup ? [convertedSubgroup] : undefined
        };
    }
    //Assign the state default values 
    //type D2 = DiagramV2_4;
    const oldDiagrams = oldModel.DiagramList ? oldModel.DiagramList.map(({ Diagram }) => ({ ...Diagram })) : [];
    const stateValDict = new Map(); //values for states
    const singleDiagrams = new Set();
    oldDiagrams.forEach((diagram) => {
        //find all the state values for diagrams that are single state diagrams
        if (diagram.singleStates !== undefined) {
            diagram.singleStates.forEach((value) => {
                stateValDict.set(value.stateName, (value.okState === "True") ? "True" : "False");
            });
            singleDiagrams.add(diagram.name);
        }
    });
    newModel.StateList.forEach(state => {
        if (singleDiagrams.has(state.diagramName)) {
            if (stateValDict.has(state.name)) {
                state.defaultSingleStateValue = stateValDict.get(state.name);
            }
            else {
                state.defaultSingleStateValue = "Ignore";
            }
        }
    });
    newModel.emraldVersion = 3.0;
    newModel.version = 1.0; //set user version for first use of this property
    return newModel;
}

class Upgrade {
    constructor(modelTxt) {
        this._emraldVersion = 0.0;
        this._oldModelTxt = modelTxt;
        let modelObj = null;
        this._newModelTxt = "";
        this._newModel = undefined;
        this._emraldVersion = 0.0;
        this._errors = [];
        if (modelTxt != "") {
            modelObj = JSON.parse(modelTxt);
            //using emraldVersion for now
            try {
                this._emraldVersion = ('emraldVersion' in modelObj) ? modelObj.emraldVersion : null;
                if (this._emraldVersion == null) //if no emraldVersion use old version tag.
                    this._emraldVersion = ('version' in modelObj) ? modelObj.version : 0.0;
            }
            catch {
                this._errors.push("Invalid JSON format");
            }
        }
    }
    upgradeGiveID(toVersion, setIdFunction) {
        const badModel = "Invalid EMRALD model format ";
        this._newModelTxt = this._oldModelTxt;
        // Define upgrade functions
        const upgrades = [
            { emraldVersion: 1.2, upgradeFunction: UpgradeV1_x },
            { emraldVersion: 2.4, upgradeFunction: UpgradeV2_4 },
            { emraldVersion: 3.0, upgradeFunction: UpgradeV3_0 }
        ];
        // Apply upgrades
        for (const upgrade of upgrades) {
            if (this._emraldVersion < upgrade.emraldVersion && toVersion >= upgrade.emraldVersion) {
                const upgraded = upgrade.upgradeFunction(this._newModelTxt);
                this._newModelTxt = upgraded.newModel;
                this._newModel = JSON.parse(upgraded.newModel);
                if (upgraded.errors.length > 0) {
                    this._errors.push(`${badModel}v${upgrade.emraldVersion} - ${upgraded.errors}`);
                    return false;
                }
                this._emraldVersion = upgrade.emraldVersion;
            }
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
                this._newModel.VariableList
            ];
            lists.forEach(list => {
                list.forEach(element => {
                    element.id = setIdFunction();
                });
            });
        }
        return true;
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
}

function UpgradeEMRALDModel(modelTxt) {
    let runUpG = new Upgrade(modelTxt);
    runUpG.upgradeGiveID(3.0, undefined);
    return runUpG.newModelStr;
}

