import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useVariableContext } from '../../../../../../../../contexts/VariableContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import { MAAPFormData } from '../../../../../../../../types/EMRALD_Model';

const Outputs = () => {
  const { formData, setFormData, setVariableName } = useCustomForm();
  const [docLinkVariable, setDocLinkVariable] = useState<string>(formData.docLinkVariable || '');
  const [output, setOutput] = useState<string>(formData.output || '');
  const { variableList } = useVariableContext();

  const docLinkVariables = variableList.value
    .filter(({ varScope }) => varScope === 'gtDocLink')
    .map(({ name }) => name);

  useEffect(() => {
    setFormData((prevFormData: MAAPFormData) => {
      const data: MAAPFormData = {
        ...prevFormData,
        docLinkVariable: docLinkVariable,
        output: output,
      };
      return data;
    });

    setVariableName(docLinkVariable);
  }, [docLinkVariable, output, setDocLinkVariable, setOutput]);

  return (
    <Box>
      <Typography fontWeight={600} fontSize={18}>
        Outputs
      </Typography>

      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <Autocomplete
            freeSolo
            options={docLinkVariables}
            value={docLinkVariable}
            renderInput={(params) => <TextField {...params} label="Doc Link Variables" />}
            onChange={(_, event) => setDocLinkVariable(event || '')}
            onInputChange={(_, newInputValue) => setDocLinkVariable(newInputValue)}
            sx={{ width: '250px' }}
            size="small"
          />
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="output-label">Output</InputLabel>
            <Select
              labelId="output-label"
              id="output-variables"
              label="Output"
              value={output || ''}
              onChange={(event) => setOutput(event.target.value)}
            >
              <MenuItem value="true">Core Uncovery</MenuItem>
              <MenuItem value="false" disabled>
                Vessel Failure
              </MenuItem>
              <MenuItem value="none" disabled>
                Containment Failure
              </MenuItem>
            </Select>
          </FormControl>

          <IconButton sx={{ width: 40, height: 40 }} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1, width: '50%' }} />
      </Box>
    </Box>
  );
};

export default Outputs;
