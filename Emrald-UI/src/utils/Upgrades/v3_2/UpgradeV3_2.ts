import type { EMRALD_Model as EMRALD_ModelV3_1 } from '../v3_1/AllModelInterfacesV3_1';
import type {
  EMRALD_Model,
  GeometryInfo,
  MAAPFormData,
  Main_Model,
} from './AllModelInterfacesV3_2';

export function UpgradeV3_2(modelTxt: string) {
  return {
    newModel: JSON.stringify(
      UpgradeV3_2_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_1),
    ),
    errors: [],
  };
}

function UpgradeV3_2_Recursive(oldModel: EMRALD_ModelV3_1): EMRALD_Model {
  const upgradeModel = (oldModel: EMRALD_ModelV3_1): Main_Model => ({
    ...oldModel,
    ActionList: oldModel.ActionList.map(action => ({
      ...action,
      formData: action.formData as MAAPFormData, // Differences in types are just superficial, so this casts them to get typescript to stop complaining
    })),
    StateList: oldModel.StateList.map(state => {
      let geometryInfo = state.geometryInfo as GeometryInfo;
      if (
        state.geometryInfo === undefined
        && typeof state.geometry === 'string'
      ) {
        geometryInfo = JSON.parse(
          state.geometry.replace(/([A-z]+):\s/g, '"$1": '),
        ) as GeometryInfo;
      }
      return {
        ...state,
        geometryInfo,
      };
    }),
    emraldVersion: 3.2,
  });

  return {
    ...upgradeModel(oldModel),
    templates: oldModel.templates?.map(template => {
      return upgradeModel(template);
    }),
  };
}
