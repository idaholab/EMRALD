import { Diagram } from "../ModelInterfaces/Current/Diagram";
import { EMRALD_Model } from "../ModelInterfaces/Current/EMRALD_Model";
import { Diagram as DiagramV_2_4 } from "./v2_4/AllModelInterfacesV2_4";
import { UpgradeV1_x } from "./v1_x/UpgradeV1_x"
import { UpgradeV2_4 } from "./v2_4/UpgradeV2_4"
import { UpgradeV3_0 } from "./v3_0/UpgradeV3_0"

export class Upgrade
{
    private _oldModelTxt: string;
    private _newModelTxt: string;
    private _newModel?: EMRALD_Model;
    private _version : number; 
    private _errors : string;



    constructor(modelTxt: string) 
    {
        this._oldModelTxt = modelTxt;
        const modelObj = JSON.parse(modelTxt);
        this._version = ('verson' in modelObj) ? modelObj.version : 0.0;
        this._newModelTxt = "";
        this._newModel = undefined;
        this._version = 0.0;
        this._errors = "";
    }

    upgrade(toVersion : number) : boolean
    {
        const badModel = "Invalid EMRALD model format ";
        this._newModelTxt = this._oldModelTxt;
        
        //go through each upgrade version 
        if(this._version < 1.2){
            var upgraded = UpgradeV1_x(this._newModelTxt);
            this._newModelTxt = upgraded.newModel;
            this._newModel = JSON.parse(upgraded.newModel); 

            if(upgraded.errors.length > 0){
                this._errors = badModel + "v1.2 -" + upgraded.errors;
                return false;
            }
            this._version = 1.2;     
        } 
        
        if((this._version < 2.4) && (toVersion >= 2.4)){
            var upgraded = UpgradeV2_4(this._newModelTxt);
            this._newModelTxt = upgraded.newModel;
            this._newModel = JSON.parse(upgraded.newModel); 

            if(upgraded.errors.length > 0){
                this._errors = badModel + "v2.4 -" + upgraded.errors;
                return false;
            }
            this._version = 2.4; 
        } 

        if((this._version < 3.0) && (toVersion >= 3.0)){
            var upgraded = UpgradeV3_0(this._newModelTxt);
            this._newModelTxt = upgraded.newModel;
            this._newModel = JSON.parse(upgraded.newModel);
            
            if(upgraded.errors.length > 0){
                this._errors = badModel + "v2.4 -" + upgraded.errors;
                return false;
            }
            this._version = 3.0; 
        } 
        
        return true;
    }

    get newModel (): EMRALD_Model | undefined {
        return this.newModel;
    }

    get newModelStr (): string {
        return JSON.stringify(this._newModel);
    }

    get errorsStr (): string {
        return JSON.stringify(this._errors);
    }
}