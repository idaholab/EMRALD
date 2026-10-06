import type {
  EMRALD_Model as EMRALD_ModelV3_3,
  MAAPFormData,
} from '../v3_3/AllModelInterfacesV3_3';
import type {
  Action,
  EMRALD_Model,
  Main_Model,
} from './AllModelInterfacesV3_4';

export function UpgradeV3_4(modelTxt: string) {
  return {
    newModel: JSON.stringify(
      UpgradeV3_4_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_3),
    ),
    errors: [],
  };
}

function UpgradeV3_4_Recursive(oldModel: EMRALD_ModelV3_3): EMRALD_Model {
  const upgradeModel = (oldModel: EMRALD_ModelV3_3): Main_Model => ({
    ...oldModel,
    emraldVersion: 3.4,
    ActionList: oldModel.ActionList.map(action => {
      const oldFormData = action.formData as MAAPFormData | undefined;
      // Some older models still floating around need to have these properties explicitly deleted
      delete oldFormData?.sections;
      delete oldFormData?.varLinks;

      if (
        oldFormData
        && typeof oldFormData.possibleInitiators?.[0] === 'string'
      ) {
        oldFormData.possibleInitiators = oldFormData.possibleInitiators.map(
          i => ({
            type: 'parameter',
            value: {
              type: 'identifier',
              value: i as unknown as string,
            },
          }),
        );
      }

      const newAction: Action = {
        ...action,
        formData: oldFormData,
      };
      return newAction;
    }),
    templates: oldModel.templates?.map(template => upgradeModel(template)),
  });

  return upgradeModel(oldModel);
}
