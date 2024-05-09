import React, { useEffect, useState } from 'react'
import { useCustomForm } from './useCustomForm';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const CustomFormTemplate: React.FC = () => {
  // Items available for use within the custom form /
  const { 
    formData, 
    isValid,
    diagrams, 
    logicNodes, 
    variables, 
    states, 
    events, 
    actions,
    setFormData,
    ReturnPreCode,
    ReturnPostCode,
    ReturnUsedVariables,
    ReturnExePath 
  } = useCustomForm();

  // Initialize states for form fields you plan to use. Below are some examples.
  // Use the initial values from the formData object provided by the useCustomForm

  const [exePath, setExePath] = useState(formData?.exePath || ''); // <-- formData?.exePath makes sure that value stored in formData will populate if it exists
  const [inputPath, setInputPath] = useState(formData?.inputPath || '');
  const [includedVariable, setIncludedVariable] = useState(formData?.includedVariable || '');

  const createPreProcessCode = () => {
    return `string inpLoc = @"${inputPath}";`;
  }

  
  /*  useEffect hook to handle form data updates
      This effect is triggered whenever items in the dependency array change. 
      Make sure to include in the formData the fields that you want to be save.

      ReturnPreCode, ReturnPostCode, ReturnUsedVariables, and ReturnExePath are required for the custom form to work.
      Make sure that these functions are called. If they are not called, the form will fail validation and display an error.
  */
  useEffect(() => {

    // Examples of using the required functions for the custom form.
    // For each of the first three required functions use a function, variable, or string as needed. Function must return a string.
    ReturnPreCode(createPreProcessCode()); // <-- Call a function instead of a string.
    ReturnExePath(exePath); 
    ReturnPostCode(`string inpLoc = @"${inputPath}"; 
    string docVarPath = @".\MAAP\temp.log"; //whatever you assigned the results variables to
    string resLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\EMRALD_MAAP\" + Path.GetFileNameWithoutExtension(inpLoc) + ".log";
    File.Copy(resLoc, docVarPath, true);`); // <-- Create a string and replace the values with what is needed
    ReturnUsedVariables(includedVariable); // <-- Must return an array of valid variable names. For example: ['var1', 'var2']

    setFormData(
      { 
        ...formData, 
        exePath,     // <-- Update the formData object with the new values 
        inputPath,
        includedVariable
      }
    );
  }, [exePath, inputPath, includedVariable]); // <-- The dependency array is here


  return (
    <>
    {isValid ? (
      <Box display={'flex'} flexDirection={'column'}>

        {/* All custom form fields will go here. Below are some examples */}

        <TextField
          id="executableLocation"
          label="Executable Location"
          margin="normal"
          variant="outlined"
          size="small"
          sx={{ mb: 0, mt: 2 }}
          value={exePath}
          onChange={(e) => setExePath(e.target.value)}
          fullWidth
        />
  
        <FormControl sx={{ mt: 2, minWidth: 120 }} size="small">
          <InputLabel id="select-label">
            Custom Application Type
          </InputLabel>
          <Select
            value={includedVariable}
            onChange={(e) => setIncludedVariable(e.target.value)}
            label="Custom Application Type"
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {variables.map((option) => (
              <MenuItem value={option.name} key={option.id}>
                <em>{option.name}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        <TextField
          id="inputPath"
          label="Input Path"
          margin="normal"
          variant="outlined"
          size="small"
          sx={{ mb: 0, mt: 2 }}
          value={inputPath}
          onChange={(e) => setInputPath(e.target.value)}
          fullWidth
        />

        {/* All custom form fields should go above here */}
    </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150}}>
          <Typography variant="subtitle1" fontWeight={600}>
            This Custom Form is missing required functionality.
          </Typography>
        </Box>
      )}
    </>
  )
}

export default CustomFormTemplate;
