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

export async function validateModel (eModel: EMRALD_Model): Promise<string> {
    const upgradeModel = new Upgrade("");
    await upgradeModel.validateModel(eModel); 
    return upgradeModel.errorsStr;
}
