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
  errorLimit: number;
  truncated: boolean;
}

export const MODEL_VALIDATION_ERROR_LIMIT = 25;

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

function formatPath(path: string) {
  if (!path) {
    return 'model';
  }

  return path
    .split('/')
    .filter(Boolean)
    .map((part) => {
      const decoded = part.replace(/~1/g, '/').replace(/~0/g, '~');
      return /^\d+$/.test(decoded) ? `[${decoded}]` : `.${decoded}`;
    })
    .join('')
    .replace(/^\./, '');
}

function groupPath(path: string) {
  const segments = path.split('/').filter(Boolean);
  const formDataIndex = segments.indexOf('formData');
  if (formDataIndex >= 0) {
    return formatPath(
      `/${segments.slice(0, Math.min(formDataIndex + 3, segments.length)).join('/')}`,
    );
  }

  if (segments.length >= 2 && /^\d+$/.test(segments[1] ?? '')) {
    return formatPath(`/${segments.slice(0, 2).join('/')}`);
  }

  return formatPath(path);
}

function formatValidationError(error: ErrorObject) {
  const instancePath = error.instancePath || '';
  const detailPath = formatPath(instancePath || error.schemaPath);
  const groupedPath = groupPath(instancePath);
  const property = typeof error.params.additionalProperty === 'string'
    ? ` "${error.params.additionalProperty}"`
    : '';
  const missingProperty = typeof error.params.missingProperty === 'string'
    ? ` "${error.params.missingProperty}"`
    : '';
  const message = `${error.message ?? 'schema validation error'}${property}${missingProperty}`;

  return groupedPath === detailPath
    ? `${detailPath}: ${message}`
    : `${groupedPath}: ${detailPath}: ${message}`;
}

export function validateModel(model: EMRALD_Model): ModelValidationResult {
  const errors: string[] = [];
  let truncated = false;
  const addError = (message: string) => {
    if (errors.length < MODEL_VALIDATION_ERROR_LIMIT) {
      errors.push(message);
    } else {
      truncated = true;
    }
  };

  if (model.emraldVersion !== EMRALD_SchemaVersion) {
    addError(
      `model.emraldVersion: Model schema version ${String(model.emraldVersion)} does not match the latest schema version ${EMRALD_SchemaVersion.toString()}.`,
    );
  }
  try {
    const ajv = new Ajv({ allErrors: false, strict: false });
    const validate = ajv.compile(EMRALD_JsonSchema);
    const isValid = validate(model);
    if (!isValid && validate.errors) {
      for (const e of validate.errors) {
        addError(formatValidationError(e));
      }
    }
  } catch (error) {
    addError((error as Error).message);
  }

  return {
    valid: errors.length === 0,
    schemaVersion: EMRALD_SchemaVersion,
    errors,
    errorLimit: MODEL_VALIDATION_ERROR_LIMIT,
    truncated,
  };
}
