import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useVariableContext } from '../../../../../../../../contexts/VariableContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';

const Outputs = () => {
  const [docLinkVariable, setDocLinkVariable] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const { variableList } = useVariableContext();
  const { formData, setFormData } = useCustomForm();
  const docLinkVariables = variableList.value
    .filter(({ varScope, docType }) => varScope === 'gtDocLink' && docType === 'dtXML')
    .map(({ name }) => name);

  useEffect(() => {
    setDocLinkVariable(formData.docLinkVariable || '');
    setOutput(formData.output || '');
  }, []);

  useEffect(() => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      docLinkVariable: docLinkVariable,
      output: output,
    }));
  }, [docLinkVariable, output]);

  return (
    <Box>
      <Typography fontWeight={600} fontSize={18}>
        Outputs
      </Typography>

      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="doc-link-variables-label">Doc Link Variables</InputLabel>
            <Select
              labelId="doc-link-variables-label"
              id="doc-link-variables"
              label="Doc Link Variables"
              value={docLinkVariable}
              onChange={(event) => setDocLinkVariable(event.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 350,
                  },
                },
              }}
            >
              {docLinkVariables.map((variable, index) => (
                <MenuItem key={index} value={variable}>
                  {variable}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="output-label">Output</InputLabel>
            <Select
              labelId="output-label"
              id="output-variables"
              label="Output"
              value={output}
              onChange={(event) => setOutput(event.target.value)}
            >
              <MenuItem value="true">Core Uncovery</MenuItem>
              <MenuItem value="false">Vessel Failure</MenuItem>
              <MenuItem value="none">Containment Failure</MenuItem>
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
