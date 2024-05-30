import { Upgrade } from "./upgradeGiveID";
import { v4 as uuidv4 } from 'uuid';
import { EMRALD_Model } from "../../types/EMRALD_Model";
import Ajv from "ajv"


 export function upgradeModel (toVersion: number, emraldData : string): EMRALD_Model | null{
    const upgradeModel = new Upgrade(emraldData);
    upgradeModel.upgradeGiveID(3.0, uuidv4); // upgrade to version 3.0 true;
    if((upgradeModel.errorsStr.length >  0) &&  (upgradeModel.errorsStr[0] != "")){
        console.log(upgradeModel.errorsStr);
        return null;
    } else {
        return upgradeModel.newModel as EMRALD_Model;
    }
}

//export async function validateModel (eModel: EMRALD_Model): Promise<string[]> {
//    const upgradeModel = new Upgrade("");
//    await upgradeModel.validateModel(eModel); 
//    return upgradeModel.errorsStr;
//}

export async function validateModel(model: EMRALD_Model): Promise < string[] > {
  var _errors = [];
  const schemaPath = './src/utils/Upgrades/v3_0/EMRALD_JsonSchemaV3_0.json';

  try {
    const response = await fetch(schemaPath);
    if (!response.ok) {
        throw new Error("Failed to fetch schema text");
    }
    const schemaTxt = await response.text();
    // Create a new instance of Ajv
    const ajv = new Ajv();
    // Compile the JSON schema
    const schema = JSON.parse(schemaTxt);
    const validate = ajv.compile(schema);
    // Validate the data against the schema
    const isValid = validate(model);
    if (!isValid) {
        validate.errors?.forEach(e => {
            _errors.push(`${e.message} - ${e.schemaPath}`);
        });
    }
  }
  catch (error : any) {
      _errors = error.message;
  }
  return _errors;
}
