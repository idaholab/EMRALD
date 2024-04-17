import {Upgrade} from './Upgrades/upgradeGiveID';

export function UpgradeEMRALDModel(modelTxt : string ) : string{
  let runUpG = new Upgrade(modelTxt);
  runUpG.upgradeGiveID(3.0, undefined);
  return runUpG.newModelStr;
}