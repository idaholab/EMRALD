import type { EMRALD_Model as EMRALD_ModelV3_1 } from '../v3_1/AllModelInterfacesV3_1';
import type { EMRALD_Model, Main_Model } from './AllModelInterfacesV3_2';

export function UpgradeV3_2(modelTxt: string) {
  return {
    newModel: JSON.stringify(UpgradeV3_2_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_1)),
    errors: [],
  };
}

function UpgradeV3_2_Recursive(oldModel: EMRALD_ModelV3_1): EMRALD_Model {
  const upgradeModel = (oldModel: EMRALD_ModelV3_1): Main_Model => {
    return {
      ...oldModel,
      StateList: oldModel.StateList.map((state) => {
        const { geometryInfo } = state;
        if (typeof state.geometryInfo === 'undefined' && typeof state.geometry === 'string') {
          eval(`geometryInfo = ${state.geometry}`); // TODO: This is really bad practice, but the geometry property isn't stored as proper JSON somehow
        }
        return {
          ...state,
          geometryInfo,
        };
      }),
      emraldVersion: 3.2,
    };
  };

  return {
    ...upgradeModel(oldModel),
    templates: oldModel.templates?.map((template) => {
      return upgradeModel(template);
    }),
  };
}
