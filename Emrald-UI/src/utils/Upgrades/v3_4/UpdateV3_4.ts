import type { EMRALD_Model as EMRALD_ModelV3_3 } from '../v3_3/AllModelInterfacesV3_3';
import type { EMRALD_Model, Main_Model } from './AllModelInterfacesV3_4';

export function UpgradeV3_4(modelTxt: string) {
  return {
    newModel: JSON.stringify(
      UpgradeV3_4_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_3),
    ),
    errors: [],
  };
}

/**
 * The only schema change is the addition of "filename", which gets set when a model file is opened but doesn't need to exist in old models.
 */
function UpgradeV3_4_Recursive(oldModel: EMRALD_ModelV3_3): EMRALD_Model {
  const upgradeModel = (oldModel: EMRALD_ModelV3_3): Main_Model => ({
    ...oldModel,
    emraldVersion: 3.4,
  });

  return {
    ...upgradeModel(oldModel),
    templates: oldModel.templates?.map(template => upgradeModel(template)),
  };
}
