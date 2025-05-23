import { MAAPFormData } from '../../../components/forms/ActionForm/FormFieldsByType/RunApplication/CustomForms/MAAP/maap';
import { UpgradeReturn } from '../v1_x/UpgradeV1_x';
import { EMRALD_Model as EMRALD_ModelV3_0, Action as ActionV3_0 } from '../v3_0/AllModelInterfacesV3_0';
import { EMRALD_Model } from './AllModelInterfacesV3_1';

export function UpgradeV3_1(modelTxt: string): UpgradeReturn {
  return {
    newModel: JSON.stringify(UpgradeV3_1_Recursive(JSON.parse(modelTxt) as EMRALD_ModelV3_0)),
    errors: [],
  };
}

function UpgradeV3_1_Recursive(oldModel: EMRALD_ModelV3_0): EMRALD_Model {
  function upgradeMAAP(action: ActionV3_0) {
    if (action.actType !== 'atRunExtApp' || !action.formData) { // All actions with formData prior to this version are MAAP action
      return action;
    }
    // Forces the 
    const formData = action.formData as MAAPFormData;
    action.formData.exePath = action.formData.exePath.replace(/\\/g, '/').replace(/^\"/, '').replace(/\"$/, '');
    delete action.formData.inputFile;
    delete action.formData.parameterFile;
    delete action.formData.
  }

  return {
    ...oldModel,
    ActionList: oldModel.ActionList.map((action) => upgradeMAAP(action)),
    versionHistory: [],
    emraldVersion: 3.1,
  };
}
