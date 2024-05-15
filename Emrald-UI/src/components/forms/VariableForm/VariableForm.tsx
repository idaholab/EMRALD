import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Variable } from '../../../types/Variable';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../MainDetailsForm';
import { useVariableContext } from '../../../contexts/VariableContext';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DocLinkFields from './FormFieldsByType/DocLinkFields';
import ExtSimFields from './FormFieldsByType/ExtSimFields';
import {
  DocVarType,
  MainItemTypes,
  VarScope,
  VariableType,
} from '../../../types/ItemTypes';
import AccrualFields from './FormFieldsByType/AccrualFields';
import { useVariableFormContext } from './VariableFormContext';

interface VariableFormProps {
  variableData?: Variable;
}

const VariableForm: React.FC<VariableFormProps> = ({ variableData }) => {
  const {
    accrualStatesData,
    name,
    namePrefix,
    desc,
    type,
    varScope,
    value,
    sim3DId,
    resetOnRuns,
    docType,
    docPath,
    docLink,
    pathMustExist,
    InitializeForm,
    setNamePrefix,
    setName,
    handleClose,
    setValue,
    setType,
    setDesc,
    setResetOnRuns,
    setDocType,
    setDocPath,
    setDocLink,
    setVarScope,
    setSim3DId,
    setPathMustExist,
  } = useVariableFormContext();

  const { updateVariable, createVariable } = useVariableContext();

  useEffect(() => {
    InitializeForm(variableData);
  }, []);

  // Maps 'type' values to their corresponding prefixes.
  const PREFIXES: Record<string, string> = {
    string: 'Str_',
    double: 'Dbl_',
    bool: 'Bool_',
    default: 'Int_',
  };

  const handleTypeChange = (newType: VariableType) => {
    // Determine the prefix based on the 'type' value, or use 'default' if not found.
    const updatedPrefix: string = PREFIXES[newType] || PREFIXES.default;
    setNamePrefix(updatedPrefix);

    // Extract the part of the name after the prefix.
    const nameWithoutPrefix: string = name ? name.split('_')[1] : '';

    // Set the 'name' state variable with the updated prefix and the extracted part.
    setName(`${updatedPrefix}${nameWithoutPrefix}`);

    if (newType === 'bool') setValue('');
  };

  const handleNameChange = (updatedName: string) => {
    // Check if the updated name already contains the prefix
    if (namePrefix) {
      const hasPrefix = updatedName.startsWith(namePrefix);

      // Set the name with the appropriate prefix
      setName(hasPrefix ? updatedName : `${namePrefix}${updatedName}`);
    }
  };

  const handleSave = () => {
    const newVariable = {
      id: uuidv4(),
      type,
      name,
      desc,
      varScope,
      sim3DId,
      docType: docType as DocVarType,
      docPath,
      docLink,
      pathMustExist,
      value,
      accrualStatesData,
      resetOnRuns,
    };

    variableData
      ? updateVariable({
          id: variableData.id,
          type,
          name,
          desc,
          varScope,
          sim3DId,
          docType: docType as DocVarType,
          docPath,
          docLink,
          pathMustExist,
          value,
          accrualStatesData,
          resetOnRuns,
        })
      : createVariable(newVariable);
    handleClose();
  };

  const handleFloatValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseFloat(e.target.value); // Convert string to number
    // check if the value is a number
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
    } else {
      setValue('');
    }
  };
  const handleBoolValueChange = (e: SelectChangeEvent<string>) => {
    const boolValue: boolean = e.target.value === 'true';
    setValue(boolValue);
  };
  const handleStringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return (
    <Box mx={3}>
      <Typography variant="h5" my={3}>
        {variableData ? `Edit` : `Create`} Variable
      </Typography>
      <form>
        <MainDetailsForm
          itemType={MainItemTypes.Variable}
          type={type}
          setType={setType}
          handleTypeChange={handleTypeChange}
          typeOptions={[
            { value: 'int', label: 'Int' },
            { value: 'double', label: 'Double' },
            { value: 'bool', label: 'Boolean' },
            { value: 'string', label: 'String' },
          ]}
          typeDisabled={varScope === 'gtAccrual'}
          name={name}
          setName={handleNameChange}
          desc={desc}
          setDesc={setDesc}
        />
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 120, width: '100%', my: 1 }}
        >
          <InputLabel id="demo-simple-select-standard-label">Scope</InputLabel>
          <Select
            labelId="var-scope"
            id="var-scope"
            value={varScope}
            onChange={(event: SelectChangeEvent<string>) => {
              setVarScope(event.target.value as VarScope);
              if (event.target.value === 'gtAccrual') {
                setType('double');
                handleTypeChange('double');
              }
            }}
            label="scope"
          >
            <MenuItem value="gtGlobal">Global</MenuItem>
            <MenuItem value="gt3DSim">Ext. Sim Variable</MenuItem>
            <MenuItem value="gtDocLink">Document Link</MenuItem>
            <MenuItem value="gtAccrual">Accrual</MenuItem>
          </Select>
        </FormControl>

        {(varScope === 'gtGlobal' || varScope === 'gt3DSim') && (
          <>
            {type == 'int' || type == 'double' ? (
              <TextField
                label="Value"
                margin="normal"
                variant="outlined"
                type="number"
                size="small"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFloatValueChange(e)
                }
                fullWidth
              />
            ) : type == 'bool' ? (
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120, width: '100%', my: 1 }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Start Value
                </InputLabel>
                <Select
                  labelId="value"
                  id="value"
                  value={value as string}
                  onChange={(event: SelectChangeEvent<string>) =>
                    handleBoolValueChange(event)
                  }
                  label="Start Value"
                  fullWidth
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                label="Value"
                margin="normal"
                variant="outlined"
                type="string"
                size="small"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleStringValueChange(e)
                }
                fullWidth
              />
            )}

            <FormControlLabel
              label="Reset to initial value for every simulation run"
              control={
                <Checkbox
                  checked={resetOnRuns ? true : false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setResetOnRuns(e.target.checked)
                  }
                />
              }
            />
            {varScope === 'gt3DSim' && (
              <ExtSimFields
                sim3DId={sim3DId ? sim3DId : ''}
                setSim3DId={setSim3DId}
              />
            )}
          </>
        )}
        {varScope === 'gtDocLink' && (
          <DocLinkFields
            docType={docType ? docType : ''}
            setDocType={setDocType}
            docPath={docPath ? docPath : ''}
            setDocPath={setDocPath}
            docLink={docLink ? docLink : ''}
            setDocLink={setDocLink}
            pathMustExist={pathMustExist}
            setPathMustExist={setPathMustExist}
            value={value}
            type={type}
            setValue={
              type === 'int' || type === 'double'
                ? handleFloatValueChange
                : type == 'bool'
                ? handleBoolValueChange
                : handleStringValueChange
            }
          />
        )}
        {varScope === 'gtAccrual' && <AccrualFields />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => handleSave()}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default VariableForm;
