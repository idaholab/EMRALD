import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { value } from 'jsonpath';
import { StyledTableCell, StyledTableRow } from '../../../ActionToStateTable';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{flex: 1}}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: '100%'}}>
          {children}
        </Box>
      )}
    </Box>
  );
}

const CustomForms = () => {
  const [customFormType, setCustomFormType] = useState('');
  const [parameterFile, setParameterFile] = useState('');
  const [inputFile, setInputFile] = useState('');
  const customFormOptions = [
    {
      label: 'Open Error Pro',
      value: 'openErrorPro',
    },
    {
      label: 'MAAP',
      value: 'maap',
    },
  ];
  
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">
          Custom Application Type
        </InputLabel>
        <Select
          value={customFormType}
          onChange={(e) => setCustomFormType(e.target.value)}
          label="Custom Application Type"
          inputProps={{ 'aria-label': 'Without label' }}
        >
          {customFormOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              <em>{option.label}</em>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id="executableLocation"
        label="Executable Location"
        margin="normal"
        variant="outlined"
        size="small"
        sx={{ mb: 0, mt: 2 }}
        // value={name}
        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        fullWidth
      />

      {customFormType === 'maap' && (
        <>
          <Box>
            <Box display={'flex'} alignItems={'center'} mt={2}>
              <Button
                sx={{ maxWidth: 180 }}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<FileUploadIcon />}
              >
                Parameter file
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setParameterFile(file ? file.name : '');
                  }}
                />
              </Button>
              {parameterFile && (
                <Typography sx={{ ml: 3, fontSize: 18 }}>
                  {parameterFile}
                </Typography>
              )}
            </Box>
            <TextField
              id="parameterLocation"
              label="Parameter File Path"
              margin="normal"
              variant="outlined"
              size="small"
              sx={{ mb: 0, mt: 2 }}
              // value={name}
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              fullWidth
            />
          </Box>
          <Box>
            <Box display={'flex'} alignItems={'center'} mt={2}>
              <Button
                sx={{ maxWidth: 180 }}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<FileUploadIcon />}
              >
                Input file
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    setInputFile(file ? file.name : '');
                  }}
                />
              </Button>
              {inputFile && (
                <Typography sx={{ ml: 3, fontSize: 18 }}>
                  {inputFile}
                </Typography>
              )}
            </Box>
            <TextField
              id="inputLocation"
              label="Input File Path"
              margin="normal"
              variant="outlined"
              size="small"
              sx={{ mb: 0, mt: 2 }}
              // value={name}
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              fullWidth
            />
          </Box>
          <Divider sx={{ my: 3 }} />

          <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="basic tabs example" 
              orientation="vertical"
            >
              <Tab label="Parameters" />
              <Tab label="Initiators" />
              <Tab label="Input Blocks" />
              <Tab label="Outputs" />
            </Tabs>
          
          <CustomTabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table aria-label="Action To State Table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', p: 2 }}>
                      Parameter
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Value
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Use Variable
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      ZWCTLSG
                    </TableCell>
                    <TableCell>
                      35
                    </TableCell>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Initiators
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Input Blocks
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Outputs
          </CustomTabPanel>
          </Box>

          <Box>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="basic tabs example" 
            >
              <Tab label="Parameters" />
              <Tab label="Initiators" />
              <Tab label="Input Blocks" />
              <Tab label="Outputs" />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            parameters
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Initiators
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Input Blocks
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Outputs
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
};

export default CustomForms;
