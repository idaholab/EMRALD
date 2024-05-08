import { Upgrade } from "./upgradeGiveID";
import { v4 as uuidv4 } from 'uuid';
import { EMRALD_Model } from "../../types/EMRALD_Model";



 export function upgradeModel (toVersion: number, emraldData : string): EMRALD_Model | null{
    const upgradeModel = new Upgrade(emraldData);
    upgradeModel.upgradeGiveID(3.0, uuidv4); // upgrade to version 3.0 true;
    if(upgradeModel.errorsStr != ""){
        console.log(upgradeModel.errorsStr);
        return null;
    } else {
        return upgradeModel.newModel as EMRALD_Model;
    }
}


    // upgrade(toVersion : number, resetIDs : boolean = true) : boolean
    // {
    //     const badModel = "Invalid EMRALD model format ";
    //     this._newModelTxt = this._oldModelTxt;
        
    //     //go through each upgrade version 
    //     if(this._version < 1.2){
    //         var upgraded = UpgradeV1_x(this._newModelTxt);
    //         this._newModelTxt = upgraded.newModel;
    //         this._newModel = JSON.parse(upgraded.newModel); 

    //         if(upgraded.errors.length > 0){
    //             this._errors = badModel + "v1.2 -" + upgraded.errors;
    //             return false;
    //         }
    //         this._version = 1.2;     
    //     } 
        
    //     if((this._version < 2.4) && (toVersion >= 2.4)){
    //         var upgraded = UpgradeV2_4(this._newModelTxt);
    //         this._newModelTxt = upgraded.newModel;
    //         this._newModel = JSON.parse(upgraded.newModel);  

    //         if(upgraded.errors.length > 0){
    //             this._errors = badModel + "v2.4 -" + upgraded.errors;
    //             return false;
    //         }
    //         this._version = 2.4; 
    //     } 

    //     if((this._version < 3.0) && (toVersion >= 3.0)){
    //         var upgraded = UpgradeV3_0(this._newModelTxt);
    //         this._newModelTxt = upgraded.newModel;
    //         this._newModel = JSON.parse(upgraded.newModel);
            
    //         if(upgraded.errors.length > 0){
    //             this._errors = badModel + "v2.4 -" + upgraded.errors;
    //             return false;
    //         }
    //         this._version = 3.0; 
    //     } 
        
        

    //     if(resetIDs)
    //     {
    //         this._newModel?.ActionList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //         this._newModel?.DiagramList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //         this._newModel?.EventList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //         this._newModel?.ExtSimList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //         this._newModel?.LogicNodeList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //         this._newModel?.StateList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //         this._newModel?.VariableList.forEach(element => {
    //             element.id = uuidv4();
    //         });
    //     }

    //     return true;
    // }
