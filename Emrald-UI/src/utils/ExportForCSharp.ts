import { Upgrade } from './Upgrades/upgradeGiveID';
import { EMRALD_SchemaVersion } from '../types/ModelUtils';

export function UpgradeEMRALDModel(modelTxt: string): string {
  const runUpG = new Upgrade(modelTxt);
  runUpG.upgradeGiveID(EMRALD_SchemaVersion, undefined);
  return runUpG.newModelStr;
}
