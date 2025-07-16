import type { EMRALD_Model } from '../../types/EMRALD_Model';
import { UpgradeV1_x, type UpgradeReturn } from './v1_x/UpgradeV1_x';
import { UpgradeV2_4 } from './v2_4/UpgradeV2_4';
import { UpgradeV3_0 } from './v3_0/UpgradeV3_0';
import { UpgradeV3_1 } from './v3_1/UpgradeV3_1';

interface ModelVersionFix {
    emraldVersion?: number;
    version?: number;
}

export class Upgrade {
  private _oldModelTxt: string;
  private _newModelTxt: string;
  private _newModel?: EMRALD_Model;
  private _emraldVersion: number;
  private _errors: string[];

  constructor(modelTxt: string) {
    this._emraldVersion = 0.0;
    this._oldModelTxt = modelTxt;
    let modelObj = null;

    this._newModelTxt = '';
    this._newModel = undefined;
    this._emraldVersion = 0.0;
    this._errors = [];
    if (modelTxt != '') {
      modelObj = JSON.parse(modelTxt) as EMRALD_Model;

      //using emraldVersion for now
      try {
        const m = modelObj as ModelVersionFix;
        this._emraldVersion = m.emraldVersion ?? m.version ?? 0.0;
      } catch {
        this._errors.push('Invalid JSON format');
      }
    }
  }

  upgradeGiveID(toVersion: number, setIdFunction?: () => string): boolean {
    this._newModelTxt = this._oldModelTxt;

    // Define upgrade functions
    const upgrades: {
      emraldVersion: number;
      upgradeFunction: (modelTxt: string) => UpgradeReturn;
    }[] = [
      { emraldVersion: 1.2, upgradeFunction: UpgradeV1_x },
      { emraldVersion: 2.4, upgradeFunction: UpgradeV2_4 },
      { emraldVersion: 3.0, upgradeFunction: UpgradeV3_0 },
      { emraldVersion: 3.1, upgradeFunction: UpgradeV3_1 },
    ];

    // Apply upgrades
    for (const upgrade of upgrades) {
      if (this._emraldVersion < upgrade.emraldVersion && toVersion >= upgrade.emraldVersion) {
        const upgraded = upgrade.upgradeFunction(this._newModelTxt);
        this._newModelTxt = upgraded.newModel;
        this._newModel = JSON.parse(upgraded.newModel) as EMRALD_Model;
        if (upgraded.errors.length > 0) {
          this._errors.push(
            `Invalid EMRALD model format v${upgrade.emraldVersion.toString()} - ${upgraded.errors.join(',')}`,
          );
          return false;
        }
        this._emraldVersion = upgrade.emraldVersion;
      }
    }

    if (!this.newModel) {
      this._newModel = JSON.parse(this._newModelTxt) as EMRALD_Model;
    }

    // Reset IDs if requested
    if (setIdFunction && this._newModel) {
      const lists = [
        this._newModel.ActionList,
        this._newModel.DiagramList,
        this._newModel.EventList,
        this._newModel.ExtSimList,
        this._newModel.LogicNodeList,
        this._newModel.StateList,
        this._newModel.VariableList,
      ];
      lists.forEach((list) => {
        list.forEach((element) => {
          element.id = setIdFunction();
        });
      });
    }

    return true;
  }

  get newModel(): EMRALD_Model | undefined {
    return this._newModel;
  }

  get newModelStr(): string {
    return JSON.stringify(this._newModel);
  }

  get errorsStr(): string[] {
    return this._errors;
  }
}
