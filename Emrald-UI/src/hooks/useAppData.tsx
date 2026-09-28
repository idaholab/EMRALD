import type { EMRALD_Model } from '../types/EMRALD_Model';
import { signal } from '@preact/signals-react';
import emraldData from '../emraldData.json';
import { CreateEmptyEMRALDModel } from '../types/ModelUtils';
import { repairModelReferences } from '../utils/ModelRepair';
import { upgradeModel, validateModel } from '../utils/Upgrades/upgrade';

const storedData = sessionStorage.getItem('appData');

export const appData = signal(CreateEmptyEMRALDModel());

function repairInvalidStartupModel(model: EMRALD_Model, source: string) {
  const validationResult = validateModel(model);
  if (validationResult.valid) {
    return model;
  }

  const shouldRepair = window.confirm(
    `${source} does not match EMRALD schema ${validationResult.schemaVersion.toString()}. Repair it before continuing? Repair removes unnamed items and clears invalid references.`,
  );
  if (!shouldRepair) {
    return null;
  }

  const repairedModel = repairModelReferences(model);
  const repairedValidationResult = validateModel(repairedModel);
  if (!repairedValidationResult.valid) {
    console.error('Could not repair startup model', repairedValidationResult.errors);
    return null;
  }

  return repairedModel;
}

// Try to parse & upgrade the stored model
if (storedData === null) {
  // Load & upgrades the default model
  const upgraded = upgradeModel(JSON.stringify(emraldData));
  if (upgraded) {
    appData.value = repairModelReferences(upgraded);
  } else {
    // Something has gone really wrong and the default model failed to upgrade
    // TODO: This needs an actual notification in the UI
    console.error('Could not upgrade default model!');
  }
} else {
  const upgraded = upgradeModel(storedData);
  if (upgraded === null) {
    // The user has a model in their local storage, but it failed to upgrade
    // TODO: This needs an actual notification in the UI
    console.error('Could not upgrade local model');
  } else {
    const usableModel = repairInvalidStartupModel(upgraded, 'The cached model');
    if (usableModel) {
      appData.value = usableModel;
    }
  }
}

export function updateAppData(newData: EMRALD_Model, undoData?: EMRALD_Model) {
  let updatedData;
  const dataHistory = JSON.parse(
    sessionStorage.getItem('dataHistory') ?? '[]',
  ) as EMRALD_Model[];

  if (undoData) {
    updatedData = undoData;
  } else {
    updatedData = {
      ...newData,
    };

    const newHistory = [...dataHistory, updatedData];
    if (newHistory.length >= 5) {
      newHistory.shift();
    }
    sessionStorage.setItem('dataHistory', JSON.stringify(newHistory));
  }

  appData.value = updatedData;
  sessionStorage.setItem('appData', JSON.stringify(updatedData));
}

export function clearCacheData() {
  sessionStorage.clear();
  localStorage.clear();
}
