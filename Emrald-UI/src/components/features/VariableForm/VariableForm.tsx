import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
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

interface VariableFormProps {
  variableData?: Variable;
}

const VariableForm: React.FC<VariableFormProps> = ({ variableData }) => {
  const { handleClose } = useWindowContext();
  const { updateVariable, createVariable } = useVariableContext();
  const [type, setType] = useState<string>(variableData?.type || 'int');
  const [name, setName] = useState<string>(variableData?.name || '');
  const [namePrefix, setNamePrefix] = useState<string>('');
  const [desc, setDesc] = useState<string>(variableData?.desc || '');
  const [varScope, setVarScope] = useState<string>(
    variableData?.varScope || 'gtGlobal',
  );
  const [value, setValue] = useState<number>(variableData?.value || 0);
  const [sim3DId, setSim3DId] = useState<string>(variableData?.sim3DId || '');
  const [resetOnRuns, setResetOnRuns] = useState<boolean>(
    variableData?.resetOnRuns || true,
  );
  const [docType, setDocType] = useState<string>(variableData?.docType || '');
  const [docPath, setDocPath] = useState<string>(variableData?.docPath || '');
  const [docLink, setDocLink] = useState<string>(variableData?.docLink || '');
  const [pathMustExist, setPathMustExist] = useState<boolean>(
    variableData?.pathMustExist || true,
  );

  // Maps 'type' values to their corresponding prefixes.
  const PREFIXES: Record<string, string> = {
    string: 'Str_',
    double: 'Dbl_',
    bool: 'Bool_',
    default: 'Int_',
  };

  // Handle changes to'type' and updates name prefix.
  const handleTypeChange = (updatedType: string) => {
    // Update the 'type' state variable.
    setType(updatedType);

    // Determine the prefix based on the 'type' value, or use 'default' if not found.
    const updatedPrefix: string = PREFIXES[updatedType] || PREFIXES.default;
    setNamePrefix(updatedPrefix)

    // Extract the part of the name after the prefix.
    const nameWithoutPrefix: string = name ? name.split('_')[1] : '';

    // Set the 'name' state variable with the updated prefix and the extracted part.
    setName(`${updatedPrefix}${nameWithoutPrefix}`);
  };

  const handleNameChange = (updatedName: string) => {
    const nameWithoutPrefix: string = updatedName ? updatedName.split('_')[1] : '';
    setName(`${namePrefix}${nameWithoutPrefix ? nameWithoutPrefix : ''}`);
  }

  const handleSave = () => {
    const newVariable = {
      id: uuidv4(),
      type,
      name,
      desc,
      varScope,
      sim3DId,
      docType,
      docPath,
      docLink,
      pathMustExist,
      value,
    };

    variableData
      ? updateVariable({
          id: variableData.id,
          type,
          name,
          desc,
          varScope,
          sim3DId,
          docType,
          docPath,
          docLink,
          pathMustExist,
          value,
        })
      : createVariable(newVariable);
    handleClose();
  };

  useEffect(() => {
    if (variableData) {
      setType(variableData.type || '');
      setName(variableData.name || '');
      setDesc(variableData.desc || '');
    }
  }, [variableData]);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" my={3}>
        {variableData ? `Edit` : `Create`} Variable
      </Typography>
      <form>
        <MainDetailsForm
          type={type}
          setType={handleTypeChange}
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
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={varScope}
            onChange={(event: SelectChangeEvent<string>) => {
              setVarScope(event.target.value);
              if (event.target.value === 'gtAccrual') {
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
            <TextField
              label="Value"
              margin="normal"
              variant="outlined"
              type="number"
              size="small"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(Number(e.target.value))
              }
              fullWidth
            />
            <FormControlLabel
              label="Reset to initial value for every simulation run"
              control={
                <Checkbox
                  checked={resetOnRuns}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setResetOnRuns(e.target.checked)
                  }
                />
              }
            />
            {varScope === 'gt3DSim' && (
              <ExtSimFields sim3DId={sim3DId} setSim3DId={setSim3DId} />
            )}
          </>
        )}
        {varScope === 'gtDocLink' && (
          <DocLinkFields
            docType={docType}
            setDocType={setDocType}
            docPath={docPath}
            setDocPath={setDocPath}
            docLink={docLink}
            setDocLink={setDocLink}
            pathMustExist={pathMustExist}
            setPathMustExist={setPathMustExist}
            value={value}
            setValue={setValue}
          />
        )}

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
    </Container>
  );
};

export default VariableForm;
