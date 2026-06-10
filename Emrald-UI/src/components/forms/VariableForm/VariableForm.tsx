import type { Variable, VariableType, VarScope } from '@/types/EMRALD_Model';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { StateDropTarget } from '@/components/drag-and-drop/StateDroppable';
import { useVariableContext } from '@/contexts/VariableContext';
import { useWindowContext } from '@/contexts/WindowContext';
import { appData } from '@/hooks/useAppData';
import { cleanFormItem } from '@/utils/util-functions';
import { MainDetailsForm } from '../MainDetailsForm';
import { DocLinkFields } from './FormFieldsByType/DocLinkFields';
import { ExtSimFields } from './FormFieldsByType/ExtSimFields';
import { GlobalFields } from './FormFieldsByType/GlobalFields';
import { useVariableFormContext } from './VariableFormContext';

export interface VariableFormProps {
  variableData?: Variable;
}

export const VariableForm: React.FC<VariableFormProps> = ({ variableData }) => {
  const {
    variable,
    hasError,
    extSimError,
    type,
    value,
    typeProperties,
    setValue,
    setHasError,
    setType,
  } = useVariableFormContext();
  const { updateVariable, createVariable } = useVariableContext();
  const { handleClose } = useWindowContext();

  const [name, setName] = useState('Int_');
  const [originalName, setOriginalName] = useState<string>();
  const [desc, setDesc] = useState('');
  const [varScope, setVarScope] = useState<VarScope>('gtGlobal');

  useEffect(() => {
    setName(variableData?.name ?? '');
    setType(variableData?.type ?? 'int');
    setValue(String(variableData?.value));
    if (variableData?.name) {
      setOriginalName(variableData.name);
    }
    setDesc(variableData?.desc ?? '');
    setVarScope(variableData?.varScope ?? 'gtGlobal');
  }, []);

  const handleSave = (variableData?: Variable) => {
    let _typeProperties = [...typeProperties];
    if (varScope !== 'gtDocLink') {
      _typeProperties = _typeProperties.concat([
        'resetOnRuns',
        'canMonitor',
        'monitorInSim',
        'cumulativeStats',
        'inVariable',
        'outVariable',
      ]);
    }
    if (varScope === 'gtAccrual') {
      _typeProperties.push('accrualStatesData');
    }
    const v: Variable = {
      ...cleanFormItem(variable, _typeProperties),
      objType: 'Variable',
      id: variableData?.id ?? uuid(),
      type,
      name: name.trim(),
      desc,
      value,
      varScope,
    };

    variableData ? updateVariable(v) : createVariable(v);
    handleClose();
  };

  // Maps 'type' values to their corresponding prefixes.
  const PREFIXES: Record<VariableType, string> = {
    int: 'Int_',
    string: 'Str_',
    double: 'Dbl_',
    bool: 'Bool_',
  };

  const handleTypeChange = (newType: VariableType) => {
    for (const prefix of Object.values(PREFIXES)) {
      if (name.indexOf(prefix) === 0) {
        setName(`${PREFIXES[newType]}${name.split('_')[1] ?? name}`);
      }
    }
  };

  const handleNameChange = (updatedName: string) => {
    const trimmedName = updatedName.trim();
    setHasError(
      appData.value.VariableList.filter(
        variable => variable.name !== originalName,
      ).some(variable => variable.name === trimmedName)
      || /[^a-zA-Z0-9-_]/.test(trimmedName),
    );
    setName(updatedName);
  };

  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {variableData ? `Edit` : `Create`} Variable
      </Typography>
      <form>
        <MainDetailsForm
          itemType="Variable"
          type={type}
          setType={setType}
          handleTypeChange={handleTypeChange}
          typeOptions={[
            { value: 'int', label: 'Int' },
            { value: 'double', label: 'Double' },
            { value: 'bool', label: 'Boolean' },
            { value: 'string', label: 'String' },
          ]}
          name={name}
          desc={desc}
          setDesc={setDesc}
          handleSave={() => {
            handleSave(variableData);
          }}
          handleNameChange={handleNameChange}
          nameError={hasError}
          error={hasError || extSimError}
          errorMessage="A variable with this name already exists, or the name contains an invalid character."
          reqPropsFilled={name && value !== '' ? true : false}
        >
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, width: '100%', my: 1 }}
          >
            <InputLabel id="scope-label">Scope</InputLabel>
            <Select
              aria-labelledby="scope-label"
              value={varScope}
              onChange={event => {
                setVarScope(event.target.value as VarScope);
                if (event.target.value === 'gtAccrual') {
                  setType('double');
                  handleTypeChange('double');
                }
              }}
              label="Scope"
            >
              <MenuItem value="gtGlobal">Global</MenuItem>
              <MenuItem value="gt3DSim">Ext. Sim Variable</MenuItem>
              <MenuItem value="gtDocLink">Document Link</MenuItem>
              <MenuItem value="gtAccrual">Accrual</MenuItem>
            </Select>
          </FormControl>

          {varScope === 'gtGlobal' ? (
            <GlobalFields variableData={variableData} />
          ) : varScope === 'gt3DSim' ? (
            <ExtSimFields variableData={variableData} />
          ) : varScope === 'gtDocLink' ? (
            <DocLinkFields variableData={variableData} />
          ) : (
            <>
              <GlobalFields variableData={variableData} />
              <br />
              State Accrual Variables
              <StateDropTarget />
            </>
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};
