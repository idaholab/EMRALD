//import schema from './EMRALD_JsonSchemaV3_0.json';
//import { Validator } from 'jsonschema';
import { UpgradeReturn } from '../v1_x/UpgradeV1_x'
import { EMRALD_Model as EMRALD_ModelV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { DiagramType as DiagramTypeV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { Diagram as DiagramV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { Group as GroupV2_4 } from '../v2_4/AllModelInterfacesV2_4'

import { EMRALD_Model, Group } from './AllModelInterfacesV3_0'
import { DiagramType, GeometryInfo } from './AllModelInterfacesV3_0'
import { StateEvalValue } from './AllModelInterfacesV3_0'

export function UpgradeV3_0(modelTxt: string): UpgradeReturn {
    //var m : EMRALD_ModelV2_4;
    var oldModel: EMRALD_ModelV2_4 = JSON.parse(modelTxt);
    const newModel = UpgradeV3_0_Recursive(oldModel)
    const retModel: UpgradeReturn = { newModel: JSON.stringify(newModel), errors: [] };
    return retModel;
}


function UpgradeV3_0_Recursive(oldModel: EMRALD_ModelV2_4): EMRALD_Model {
    
    //do upgrade steps for version change 2.4 to 3.0
    //remove the extra layer between all the lists so we dont have items like - "EventList" : { "Event": {...}, "Event": {...}}
    const newModel: EMRALD_Model = {
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
            var geometryInfo: GeometryInfo = parsedGeometry;
            const { geometry, id, ...rest } = State; //exclude geometry
            return {
                ...rest,                
                id: id !== undefined ? String(id) : undefined,
                geometryInfo
            };
        }) : [],
        ActionList: oldModel.ActionList ? oldModel.ActionList.map(({ Action }) => {
            const { itemId, moveFromCurrent, id, ...rest } = Action; //exclude itemId and move from current
            var mainItem : boolean = Action.mainItem ? Action.mainItem : false;
            return {
                ...rest,
                id: id !== undefined ? String(id) : undefined,
                mainItem
            };
        }) : [],
        EventList: oldModel.EventList ? oldModel.EventList.map(({ Event }) => {
            const {id, ...rest } = Event;
            var ifInState : boolean | undefined = Event.ifInState != null ?
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
        })): [],
        VariableList: oldModel.VariableList ? oldModel.VariableList.map(({ Variable }) => {
            // Destructure Variable, excluding modelRef, states, configData, and simMaxTime
            const { modelRef=null, states, configData, simMaxTime, $$hashKey, id, ...rest } = Variable;
            
            var regExpLine : number | undefined = undefined;
            if (Variable.regExpLine !== undefined){
                if(typeof Variable.regExpLine === 'string')
                    regExpLine = parseFloat(Variable.regExpLine);
                else
                    regExpLine = Variable.regExpLine;                
            }

            var begPosition : number | undefined = undefined;
            if (Variable.begPosition !== undefined){
                if(typeof Variable.begPosition === 'string')
                    begPosition = parseFloat(Variable.begPosition);
                else
                begPosition = Variable.begPosition;
            }

            
            // Map accrualStatesData if it's defined
            const accrualStatesData = Variable.accrualStatesData === undefined ? undefined :
            Variable.accrualStatesData.map( AccrualState  => {
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
    }


    //function to map changed diagram type
    function mapLogicNode(childNames: string[]) {
        //move the child name to the diagramName and create an empty stateValues array.
        return childNames ? childNames.map(child => ({ diagramName: child, stateValues: [] })) : [];
    }

    //function to map changed diagram type
    function mapDiagramType(diagramType: DiagramTypeV2_4): DiagramType {
        switch (diagramType) {
            case "dtComponent":
            case "dtSystem":
                return "dtSingle";
            default:
                return "dtMulti";
        }
    }

    function convertTemplates(templates: EMRALD_ModelV2_4[] | undefined): EMRALD_Model[] | undefined {
        if(!templates) return undefined;
        const retModelArray : EMRALD_Model[] = [];
        //convert each template to the new version
        templates.forEach(element => {
            retModelArray.push(UpgradeV3_0_Recursive(element));
        });        

        return retModelArray;
    }

    function convertGroupV2_4ToGroup(groupV2_4: GroupV2_4 | undefined): Group | undefined {
        if (!groupV2_4) return undefined; // If input is null, return null
        
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
    const oldDiagrams: DiagramV2_4[] = oldModel.DiagramList ? oldModel.DiagramList.map(({ Diagram }) => ({ ...Diagram })) : [];

    const stateValDict = new Map<string, StateEvalValue>(); //values for states
    const singleDiagrams = new Set<string>();
    oldDiagrams.forEach((diagram: DiagramV2_4) => {
        //find all the state values for diagrams that are single state diagrams
        if (diagram.singleStates !== undefined) {
            diagram.singleStates.forEach((value: { stateName: string; okState: "True" | "False" }) => {
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