import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Variable } from '../../../types/Variable';
import MainDetailsForm from '../MainDetailsForm';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DocLinkFields from './FormFieldsByType/DocLinkFields';
import ExtSimFields from './FormFieldsByType/ExtSimFields';
import { MainItemTypes, VarScope } from '../../../types/ItemTypes';
import AccrualFields from './FormFieldsByType/AccrualFields';
import { useVariableFormContext } from './VariableFormContext';

interface VariableFormProps {
  variableData?: Variable;
}

const VariableForm: React.FC<VariableFormProps> = ({ variableData }) => {
  const {
    hasError,
    name,
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
    regExpLine,
    begPosition,
    showRegExFields,
    showNumChars,
    numChars,
    InitializeForm,
    setType,
    setDesc,
    setResetOnRuns,
    setDocType,
    setDocPath,
    setDocLink,
    setVarScope,
    setSim3DId,
    setPathMustExist,
    handleTypeChange,
    handleNameChange,
    handleSave,
    handleFloatValueChange,
    handleBoolValueChange,
    handleStringValueChange,
    reset,
    setRegExpLine,
    setBegPosition,
    setShowRegExFields,
    setShowNumChars,
    setNumChars,
  } = useVariableFormContext();

  useEffect(() => {
    InitializeForm(variableData);
  }, []);

  return (
    <Box mx={3} pb={3}>
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
          name={name}
          desc={desc}
          setDesc={setDesc}
          handleSave={() => handleSave(variableData)}
          reset={reset}
          handleNameChange={handleNameChange}
          error={hasError}
          errorMessage="A variable with this name already exists."
          reqPropsFilled={name && varScope && value !== '' ? true : false}
        >
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%', my: 1 }}>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFloatValueChange(e)}
                  fullWidth
                />
              ) : type == 'bool' ? (
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 120, width: '100%', my: 1 }}
                >
                  <InputLabel id="demo-simple-select-standard-label">Start Value</InputLabel>
                  <Select
                    labelId="value"
                    id="value"
                    value={value as string}
                    onChange={(event: SelectChangeEvent<string>) => handleBoolValueChange(event)}
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleStringValueChange(e)}
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
                <ExtSimFields sim3DId={sim3DId ? sim3DId : ''} setSim3DId={setSim3DId} />
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
              regExpLine={regExpLine || 0}
              begPosition={begPosition || 0}
              setRegExpLine={setRegExpLine}
              setBegPosition={setBegPosition}
              setShowRegExFields={setShowRegExFields}
              showRegExFields={showRegExFields || false}
              numChars={numChars || 0}
              setNumChars={setNumChars}
              showNumChars={showNumChars || false}
              setShowNumChars={setShowNumChars}
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
        </MainDetailsForm>
      </form>
    </Box>
  );
};

export default VariableForm;
