import { EMRALD_Model, } from '../types/EMRALD_Model.ts';
import jsonpath from 'jsonpath';
import { MainItemTypes } from '../types/ItemTypes.ts';
import { DiagramRefsArray, GetJSONPathInRefs, GetJSONPathUsingRefs } from './ModelReferences.ts';
import { appData } from '../hooks/useAppData';
import { Diagram } from '../types/Diagram.ts';
import { State } from '../types/State.ts';
import { Action } from '../types/Action.ts';
import { Event } from '../types/Event.ts';
import { Variable } from '../types/Variable.ts';
import { LogicNode } from '../types/LogicNode.ts';
import { ExtSim } from '../types/ExtSim.ts';


export const updateSpecifiedModel = ( //Update the provided EMRALD model with all the item changed in the model provided and references if the name changes
    item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
    itemType: MainItemTypes, //This is the type of the object that was updated
    model: EMRALD_Model, //model to update
    useCopy: boolean //true - make a copy of the model and return the copy. false - Modify the passed in model directly
): Promise<EMRALD_Model> => {
    return new Promise((resolve) => {

        let updatedEMRALDModel: EMRALD_Model;
        if (useCopy)
            updatedEMRALDModel = JSON.parse(JSON.stringify(model));
        else
            updatedEMRALDModel = model;

        var itemArray: any[];
        var itemIdx = -1;

        switch (itemType) {
            case MainItemTypes.Diagram:
                itemArray = updatedEMRALDModel.DiagramList;
                break;
            case MainItemTypes.State:
                itemArray = updatedEMRALDModel.StateList;
                break;
            case MainItemTypes.Action:
                itemArray = updatedEMRALDModel.ActionList;
                break;
            case MainItemTypes.Event:
                itemArray = updatedEMRALDModel.EventList;
                break;
            case MainItemTypes.ExtSim:
                itemArray = updatedEMRALDModel.ExtSimList;
                break;
            case MainItemTypes.Variable:
                itemArray = updatedEMRALDModel.VariableList;
                break;
            case MainItemTypes.LogicNode:
                itemArray = updatedEMRALDModel.LogicNodeList;
                break;
            case MainItemTypes.EMRALD_Model:
                updatedEMRALDModel.templates = updatedEMRALDModel.templates !== undefined ? updatedEMRALDModel.templates : [];
                itemArray = updatedEMRALDModel.templates;
                break;
            default:
                //error not a valid type
                console.log("Error: Invalid type for updateModelAndReferences");
                return updatedEMRALDModel;
                break;
        }

        //find the index of the item in the array
        itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id);
        if (itemIdx < 0) {
            itemArray.push(item)
            // Resolve with the updated model
            resolve(updatedEMRALDModel);
            return;
        }
        var previousName: string = itemArray[itemIdx].name; //old name of the item

        //update the item with the new item data
        itemArray[itemIdx] = item;

        if (item.name !== previousName) {  //name change so update all the references as well
            var jsonPathRefArray: Array<[string, MainItemTypes]> = GetJSONPathUsingRefs(itemType, previousName);

            jsonPathRefArray.forEach((jsonPathSet) => {
                const jPath = jsonPathSet[0]
                jsonpath.paths(updatedEMRALDModel, jPath).forEach((ref: any) => {
                    const path = ref.join('.');
                    jsonpath.value(updatedEMRALDModel, path, item.name);
                });
            });
        }

        resolve(updatedEMRALDModel);
    })
}

export const updateModelAndReferences = ( //Update the main appData EMRALD model with all the item changed in the model provided and references if the name changes
    item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
    itemType: MainItemTypes, //This is the type of the object that was updated
): Promise<EMRALD_Model> => {
    return new Promise((resolve) => {

        const updatedEMRALDModel: EMRALD_Model = JSON.parse(JSON.stringify(appData.value));
        updateSpecifiedModel(item, itemType, updatedEMRALDModel, false);


        resolve(updatedEMRALDModel);
    })
}

export const DeleteItemAndRefsInSpecifiedModel = ( //remove the item and references to it from the provided EMRALD model
    item: Diagram | State | Action | Event | Variable | LogicNode | ExtSim | EMRALD_Model, //It is assumed the the EMRALD item passed in has already been udpated with all the object changes
    model: EMRALD_Model, //model to update
    useCopy: boolean //true - make a copy of the model and return the copy. false - Modify the passed in model directly
): Promise<EMRALD_Model> => {
    return new Promise((resolve) => {

        let updatedEMRALDModel: EMRALD_Model;
        if (useCopy)
            updatedEMRALDModel = JSON.parse(JSON.stringify(model));
        else
            updatedEMRALDModel = model;

        var itemArray: any[];
        var itemIdx = -1;

        switch (item.objType) {
            case MainItemTypes.Diagram:
                itemArray = updatedEMRALDModel.DiagramList;
                break;
            case MainItemTypes.State:
                itemArray = updatedEMRALDModel.StateList;
                break;
            case MainItemTypes.Action:
                itemArray = updatedEMRALDModel.ActionList;
                break;
            case MainItemTypes.Event:
                itemArray = updatedEMRALDModel.EventList;
                break;
            case MainItemTypes.ExtSim:
                itemArray = updatedEMRALDModel.ExtSimList;
                break;
            case MainItemTypes.Variable:
                itemArray = updatedEMRALDModel.VariableList;
                break;
            case MainItemTypes.LogicNode:
                itemArray = updatedEMRALDModel.LogicNodeList;
                break;
            case MainItemTypes.EMRALD_Model:
                updatedEMRALDModel.templates = updatedEMRALDModel.templates !== undefined ? updatedEMRALDModel.templates : [];
                itemArray = updatedEMRALDModel.templates;
                break;
            default:
                //error not a valid type
                console.log("Error: Invalid type for updateModelAndReferences");
                return updatedEMRALDModel;
                break;
        }

        //find the index of the item in the array
        itemIdx = itemArray.findIndex(itemInArray => itemInArray.id === item.id);
        if (itemIdx < 0) {
            itemArray.push(item)
            // Resolve with the updated model
            resolve(updatedEMRALDModel);
            return;
        }
        var previousName: string = itemArray[itemIdx].name; //old name of the item

        const mainItemTypesEnumValue = MainItemTypes[item.objType as keyof typeof MainItemTypes];

        // Find the paths of the items to be removed
        let jsonPathRefArray : DiagramRefsArray = GetJSONPathInRefs(mainItemTypesEnumValue, previousName);

        jsonPathRefArray.forEach((ref: any) => {
            // Find the parent array
            const itemPath = ref.join('.');
            const arrayIndex = ref[ref.length - 1];
            const itemArray = jsonpath.value(updatedEMRALDModel, itemPath);

            if (Array.isArray(itemArray)) {
                // Remove the item from the parent array
                itemArray.splice(arrayIndex, 1);
            }

            if (ref[2] != null) //remove linked array data if it exists
            {
                const parentPath = ref.slice(0, -2).join('.'); // Path to the parent array
                const parentIndex = ref[ref.length - 2];
                const parentObject = jsonpath.value(updatedEMRALDModel, parentPath);
                if (parentObject[parentIndex] && parentObject[parentIndex][ref[2]]) {
                    //remove item
                    parentObject[parentIndex][ref[2]].splice(arrayIndex, 1);
                };
            }
        });

        resolve(updatedEMRALDModel);
    })
}

//TODO call DeleteItemAndRefsInSpecifiedModel from the main delete and pass in the appData.value 
//const updatedEMRALDModel: EMRALD_Model = JSON.parse(JSON.stringify(appData.value));
//DeleteItemAndRefsInSpecifiedModel(item, updatedEMRALDModel, false);
