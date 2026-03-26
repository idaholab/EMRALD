import type { EMRALD_Model } from '../../types/EMRALD_Model';
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import { EMRALD_SchemaVersion } from '../../types/ModelUtils';
import { Upgrade } from './upgradeGiveID';

export function upgradeModel(emraldData: string, toVersion?: number) {
  const upgradeModel = new Upgrade(emraldData);
  upgradeModel.upgradeGiveID(toVersion ?? EMRALD_SchemaVersion, uuidv4); // upgrade to version 3.0 true;
  if (
    !upgradeModel.newModel
    || (upgradeModel.errorsStr.length > 0 && upgradeModel.errorsStr[0] != '')
  ) {
    console.log(upgradeModel.errorsStr);
    return null;
  } else {
    return upgradeModel.newModel;
  }
}

export async function validateModel(model: EMRALD_Model) {
  const _errors = [];
  const schemaPath = './src/utils/Upgrades/v3_0/EMRALD_JsonSchemaV3_0.json';

  try {
    const response = await fetch(schemaPath);
    if (!response.ok) {
      throw new Error('Failed to fetch schema text');
    }
    const schemaTxt = await response.text();
    // Create a new instance of Ajv
    const ajv = new Ajv();
    // Compile the JSON schema
    const schema = JSON.parse(schemaTxt) as EMRALD_Model;
    const validate = ajv.compile(schema);
    // Validate the data against the schema
    const isValid = validate(model);
    if (!isValid && validate.errors) {
      for (const e of validate.errors) {
        _errors.push(`${e.message ?? ''} - ${e.schemaPath}`);
      }
    }
  } catch (error) {
    _errors.push((error as Error).message);
  }
  return _errors;
}
