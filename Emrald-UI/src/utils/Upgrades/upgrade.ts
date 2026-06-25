import type { ErrorObject } from 'ajv';
import type { EMRALD_Model } from '../../types/EMRALD_Model';
import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import { EMRALD_JsonSchema } from '../../types/EMRALD_Model';
import { EMRALD_SchemaVersion } from '../../types/ModelUtils';
import { Upgrade } from './upgradeGiveID';

export interface ModelValidationResult {
  valid: boolean;
  schemaVersion: number;
  errors: string[];
}

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

function formatValidationError(error: ErrorObject) {
  const path = error.instancePath || error.schemaPath;
  return `${path}: ${error.message ?? 'schema validation error'}`;
}

export function validateModel(model: EMRALD_Model): ModelValidationResult {
  const errors: string[] = [];

  if (model.emraldVersion !== EMRALD_SchemaVersion) {
    errors.push(
      `Model schema version ${String(model.emraldVersion)} does not match the latest schema version ${EMRALD_SchemaVersion.toString()}.`,
    );
  }

  try {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(EMRALD_JsonSchema);
    const isValid = validate(model);
    if (!isValid && validate.errors) {
      for (const e of validate.errors) {
        errors.push(formatValidationError(e));
      }
    }
  } catch (error) {
    errors.push((error as Error).message);
  }

  return {
    valid: errors.length === 0,
    schemaVersion: EMRALD_SchemaVersion,
    errors,
  };
}
