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

const Outputs = () => {
  const { variableList } = useVariableContext();
  const docLinkVariables = variableList.value
    .filter(({ varScope }) => varScope === 'gtDocLink')
    .map(({ name }) => name);

  return (
    <Box>
      <Typography fontWeight={600} fontSize={18}>
        Outputs
      </Typography>

      <Box>
        <Box display={'flex'} alignItems={'center'}>
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <InputLabel id="doc-link-variables-label">
              Doc Link Variables
            </InputLabel>
            <Select
              labelId="doc-link-variables-label"
              id="doc-link-variables"
              label="Doc Link Variables"
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
            <Select labelId="output-label" id="output-variables" label="Output">
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
