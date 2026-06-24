import type { EMRALD_Model as EMRALD_ModelV3_2 } from '../v3_2/AllModelInterfacesV3_2';
import type { EMRALD_Model, Main_Model } from './AllModelInterfacesV3_3';

export function UpgradeV3_3(modelTxt: string) {
  return {
    newModel: JSON.stringify(
      UpgradeV3_3_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_2),
    ),
    errors: [],
  };
}

function UpgradeV3_3_Recursive(oldModel: EMRALD_ModelV3_2): EMRALD_Model {
  // v3.2 -> v3.3 adds optional distribution fields to atCngVarVal actions
  // (useDistribution, distType, parameters, dfltTimeRate). Existing actions
  // without these fields default to using scriptCode, so no transformation
  // of existing data is needed.
  const upgradeModel = (oldModel: EMRALD_ModelV3_2): Main_Model => ({
    ...oldModel,
    emraldVersion: 3.3,
  });

  return {
    ...upgradeModel(oldModel),
    templates: oldModel.templates?.map(template => upgradeModel(template)),
  };
}
