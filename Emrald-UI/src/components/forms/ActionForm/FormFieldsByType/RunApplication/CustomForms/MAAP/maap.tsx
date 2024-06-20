import React, { useEffect, useState } from 'react'
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';

const MAAP = () => {
  const {
    formData,
    isValid,
    setFormData,
    ReturnPreCode,
    ReturnPostCode,
    ReturnUsedVariables,
    ReturnExePath,
  } = useCustomForm();


  const [exePath, setExePath] = useState(formData?.exePath || '');
  const [parameterFile, setParameterFile] = useState<File | null>();
  const [parameterPath, setParameterPath] = useState(formData?.parameterPath || '');
  const [inputFile, setInputFile] = useState<File | null>();
  const [inputPath, setInputPath] = useState(formData?.inputPath || '');
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  }

  const createPreProcessCode = () => {
    return `string inpLoc = @"${inputPath}";`;
  };

  useEffect(() => {
    ReturnPreCode(createPreProcessCode());
    ReturnExePath(exePath);
    ReturnPostCode(`string inpLoc = @"${inputPath}";
    if (!Path.IsPathRooted(inpLoc))
          inpLoc = RootPath + inpLoc;
      string docVarPath = @".\\MAAP\\temp.log";
    if (!Path.IsPathRooted(docVarPath))
          docVarPath = RootPath + docVarPath;
    string resLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\EMRALD_MAAP\" + Path.GetFileNameWithoutExtension(inpLoc) + ".log";
    File.Copy(resLoc, docVarPath, true);`);
    ReturnUsedVariables('');

    setFormData({
      ...formData,
      exePath,
      inputFile,
      inputPath,
      parameterFile,
      parameterPath
    });
  }, [exePath, inputPath, parameterFile, parameterPath]);

  return (
    <>
      {isValid ? (
        <Box display={'flex'} flexDirection={'column'}>
          <TextFieldComponent 
            value={exePath} 
            label="Executable Path" 
            setValue={setExePath} 
          />

          <FileUploadComponent label="Parameter File" setFile={setParameterFile}/>

          <TextFieldComponent 
            value={parameterPath} 
            label="Parameter File Path" 
            setValue={setParameterPath} 
          />

          <FileUploadComponent label="Input File" setFile={setInputFile}/>

          <TextFieldComponent 
            value={inputPath} 
            label="Input File Path" 
            setValue={setInputPath} 
          />

          <Divider sx={{ my: 3 }} />

          <Box>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              aria-label="basic tabs example" 
            >
              <Tab label="Parameters" />
              <Tab label="Initiators" />
              <Tab label="Input Blocks" />
              <Tab label="Outputs" />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Parameters />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Initiators />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <InputBlocks />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <Outputs />
          </TabPanel>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            This Custom Form is missing required functionality.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default MAAP;
