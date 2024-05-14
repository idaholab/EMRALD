import { EMRALD_Model } from "./v3_0/AllModelInterfacesV3_0";
import { UpgradeV1_x } from "./v1_x/UpgradeV1_x"
import { UpgradeV2_4 } from "./v2_4/UpgradeV2_4"
import { UpgradeV3_0 } from "./v3_0/UpgradeV3_0"
import { UpgradeReturn } from "./v1_x/UpgradeV1_x"
import { Validator } from "jsonschema";


//import { Validator } from "../../../node_modules/jsonschema/lib/index";
//import { v4 as uuidv4 } from 'uuid';

// interface UpgradeResult {
//     newModel: string;
//     errors: string;
// }

export class Upgrade
{
    private _oldModelTxt: string;
    private _newModelTxt: string;
    private _newModel?: EMRALD_Model;
    private _emraldVersion : number; 
    private _errors : string;



    constructor(modelTxt: string) 
    {
        this._emraldVersion = 0.0;
        this._oldModelTxt = modelTxt;
        let modelObj = null;
        if(modelTxt != ""){
            modelObj = JSON.parse(modelTxt);
        
            //using emraldVersion for now
            this._emraldVersion = ('schemaVerson' in modelObj) ? modelObj.emraldVersion : null;
            if (this._emraldVersion == null) //if no emraldVersion use old version tag.
                this._emraldVersion = ('verson' in modelObj) ? modelObj.version : 0.0;
        }
        this._newModelTxt = "";
        this._newModel = undefined;
        this._emraldVersion = 0.0;
        this._errors = "";
    }



    upgradeGiveID(toVersion: number, setIdFunction?: () => void): boolean {
        const badModel = "Invalid EMRALD model format ";
        this._newModelTxt = this._oldModelTxt;
    
        // Define upgrade functions
      const upgrades: { emraldVersion: number, upgradeFunction: (modelTxt: string) => UpgradeReturn }[] = [
            { emraldVersion: 1.2, upgradeFunction: UpgradeV1_x },
            { emraldVersion: 2.4, upgradeFunction: UpgradeV2_4 },
            { emraldVersion: 3.0, upgradeFunction: UpgradeV3_0 }
        ];
    
        // Apply upgrades
        for (const upgrade of upgrades) {
          if (this._emraldVersion < upgrade.emraldVersion && toVersion >= upgrade.emraldVersion) {
                const upgraded = upgrade.upgradeFunction(this._newModelTxt);
                this._newModelTxt = upgraded.newModel;
                this._newModel = JSON.parse(upgraded.newModel);
                if (upgraded.errors.length > 0) {
                  this._errors = `${badModel}v${upgrade.emraldVersion} - ${upgraded.errors}`;
                    return false;
                }
              this._emraldVersion = upgrade.emraldVersion;
            }
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
                this._newModel.VariableList
            ];
            lists.forEach(list => {
                list.forEach(element => {
                    element.id = setIdFunction();
                });
            });
        }
    
        return true;
    }

    get newModel (): EMRALD_Model | undefined {
        return this._newModel;
    }

    get newModelStr (): string {
        return JSON.stringify(this._newModel);
    }

    get errorsStr (): string {
        return this._errors;
    }

    // 
    
    async validateModel(model: EMRALD_Model): Promise<string> {
        this._errors = "";
        const schemaPath = './src/utils/Upgrades/v3_0/EMRALD_JsonSchemaV3_0.json';
    
        try {
            const response = await fetch(schemaPath);
            if (!response.ok) {
                throw new Error("Failed to fetch schema text");
            }
            
            const schemaTxt = await response.text();
            const schema = JSON.parse(schemaTxt);
            const validator = new Validator();
            const validationResult = validator.validate(model, schema);
    
            if (!validationResult.valid) {
                validationResult.errors.forEach(error => {
                    if (this._errors !== "") {
                        this._errors += "\n";
                    }
                    this._errors = this._errors + error.instance + " - " + error.message + " : " + JSON.stringify(error.argument);
                });
            }
        } catch (error) {
            this._errors = error.message;
        }
    
        return this._errors;
    }
}