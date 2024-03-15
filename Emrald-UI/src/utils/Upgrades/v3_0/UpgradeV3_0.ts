//import schema from './EMRALD_JsonSchemaV3_0.json';
import { Validator } from 'jsonschema';
import { UpgradeReturn } from '../v1_x/UpgradeV1_x'
import { Event as EventV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { EMRALD_Model as EMRALD_ModelV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { DiagramType as DiagramTypeV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { Diagram as DiagramV2_4 } from '../v2_4/AllModelInterfacesV2_4'
import { LogicNode as LogicNodeV2_4 } from '../v2_4/AllModelInterfacesV2_4'

import { Event } from './AllModelInterfacesV3_0'
import { EMRALD_Model } from './AllModelInterfacesV3_0'
import { EventType } from './AllModelInterfacesV3_0'
import { DiagramType, GeometryInfo } from './AllModelInterfacesV3_0'
import { LogicNode } from './AllModelInterfacesV3_0'
import { State } from './AllModelInterfacesV3_0'
import { Diagram } from './AllModelInterfacesV3_0'
import { StateEvalValue } from './AllModelInterfacesV3_0'
import { Upgrade } from '../upgrade';



export function UpgradeV3_0(modelTxt: string): UpgradeReturn {
    //var m : EMRALD_ModelV2_4;
    var oldModel: EMRALD_ModelV2_4 = JSON.parse(modelTxt);
    
    //do upgrade steps for version change 2.4 to 3.0
    //remove the extra layer between all the lists so we dont have items like - "EventList" : { "Event": {...}, "Event": {...}}
    const newModel: EMRALD_Model = {
        ...oldModel,
        DiagramList: oldModel.DiagramList ? oldModel.DiagramList.map(({ Diagram }) => {
            const { diagramList, forceMerge, singleStates, ...rest } = Diagram; //exclude diagramList, forceMerge, singleStates
            return {
                ...rest, // Spread the rest of the properties
                diagramType: mapDiagramType(Diagram.diagramType) // Add the mapped diagramType
            };
        }) : [],
        ExtSimList: oldModel.ExtSimList ? oldModel.ExtSimList.map(({ ExtSim }) => {
            const { modelRef, states, configData, simMaxTime, varScope, value, resetOnRuns, type, sim3DId, ...rest } = ExtSim; //exclude
            return rest;
        }) : [],
        // StateList: oldModel.StateList ? oldModel.StateList.map(({ State }) => ({ ...State })) : [],
        StateList: oldModel.StateList ? oldModel.StateList.map(({ State }) => {
            const correctedString = State.geometry
            .replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":') // Replace property names with double quotes
            .replace(/'/g, '"'); // Replace single quotes with double quotes
            const parsedGeometry = JSON.parse(correctedString);
            var geometryInfo: GeometryInfo = parsedGeometry;
            const { geometry, ...rest } = State; //exclude geometry
            return {
                ...rest,
                geometryInfo
            };
        }) : [],
        ActionList: oldModel.ActionList ? oldModel.ActionList.map(({ Action }) => {
            const { itemId, moveFromCurrent, ...rest } = Action; //exclude itemId and move from current
            var mainItem : boolean = Action.mainItem ? Action.mainItem : false;
            return {
                ...rest,
                mainItem
            };
        }) : [],
        EventList: oldModel.EventList ? oldModel.EventList.map(({ Event }) => {
            const {...rest } = Event;
            var ifInState : boolean | undefined = Event.ifInState != null ?
                (typeof Event.ifInState === 'string' ? Event.ifInState.toUpperCase() === 'TRUE' : Event.ifInState) :
                undefined;
            return {
                ...rest,
                ifInState
            };

        }) : [],
        LogicNodeList: oldModel.LogicNodeList ? oldModel.LogicNodeList.map(({ LogicNode }) => ({
            ...LogicNode,
            isRoot: LogicNode.isRoot !== undefined ? (LogicNode.isRoot || ((LogicNode.rootName != undefined) && (LogicNode.rootName === LogicNode.name))) : 
                                                     (LogicNode.rootName == undefined ? false : (LogicNode.rootName === LogicNode.name)),
            compChildren: mapLogicNode(LogicNode.compChildren)
        })): [],
        VariableList: oldModel.VariableList ? oldModel.VariableList.map(({ Variable }) => {
            // Destructure Variable, excluding modelRef, states, configData, and simMaxTime
            const { modelRef=null, states, configData, simMaxTime, $$hashKey, ...rest } = Variable;
            
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
                accrualStatesData, // Include mapped accrualStatesData
                regExpLine,
                begPosition
            };
        }) : []
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

    newModel.version = 3.0;
    const retModel: UpgradeReturn = { newModel: JSON.stringify(newModel), errors: [] };

    //to validate the new version against the schema
    const schemaPath = './src/utils/Upgrades/v3_0/EMRALD_JsonSchemaV3_0.json';
    // const schemaTxt = fs.readFileSync(schemaPath, 'utf-8').trim();    
    
    fetch(schemaPath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch schema text");
            }
            return response.text();
        })
        .then(schemaTxt => {
            const schema = JSON.parse(schemaTxt);
            const validator = new Validator();
            console.log(validator);
            const validationResult = validator.validate(newModel, schema);
            if (validationResult.valid === false) {
                validationResult.errors.forEach(error => {
                    retModel.errors.push(error.instance + " - " + error.message + " : " + JSON.stringify(error.argument))
                });
            }
        })
        .catch(error => {
            // handle error
            console.error(error);
        });

    return retModel;
}