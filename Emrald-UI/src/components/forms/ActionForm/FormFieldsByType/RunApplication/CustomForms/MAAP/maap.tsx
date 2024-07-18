import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import { parse as InputParse } from './Parser/maap-inp-parser.ts';
import { parse as parameterParser } from './Parser/maap-par-parser.ts';

export interface Parameter {
  desc: string;
  index: number;
  value: Value;
  target: Target;
}
export interface Target {
  value: Value | string;
  type: string;
}

export interface Value {
  value: string | number;
}
export interface Initiator {
  desc: string;
  value: string;
  index: number;
}

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
  const [count, setCount] = useState<{ [key: string]: number }>({});

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

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
      parameterPath,
    });
  }, [exePath, inputPath, parameterFile, parameterPath]);

  useEffect(() => {
    handleParameterFileChange();
  }, [parameterFile]);

  useEffect(() => {
    handleInputFileChange();
  }, [inputFile]);

  const handleInputFileChange = async () => {
    if (inputFile) {
      const fileString = await inputFile.text();

      try {
        const data = InputParse(fileString, {
          locations: true,
        });

        console.log('input file data: ', data.value);

        let comments: any = [];
        let sections: any = [];
        let parameters: any = [];
        let initiators: any = [];

        data.value.forEach((sourceElement: any, i: any) => {
          if (sourceElement.type === 'comment') {
            comments.push(sourceElement);
          } else {
            sections.push(sourceElement);
          }

          switch (sourceElement.type) {
            case 'block':
              if (sourceElement.blockType === 'PARAMETER CHANGE') {
                sourceElement.value.forEach((innerElement: any) => {
                  if (innerElement.type === 'assignment') {
                    parameters.push(innerElement);
                  } else {
                    // Handle other types if needed
                  }
                });
              } else if (sourceElement.blockType === 'INITIATORS') {
                sourceElement.value.forEach((innerElement: any) => {
                  initiators.push(innerElement);
                });
              }
              break;
            default:
              break;
          }
        });

        // Set state variables or perform other actions with comments, sections, and parameters
        // setComments(comments);
        parameters = editParameterNames(parameters);
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          parameters,
          initiators,
        }));
      } catch (err) {
        console.log('Error parsing file:', err);
      }
    }
  };

  const editParameterNames = (parameters: Parameter[]) => {
    let names: string[] = [];
    let updatedCount = { ...count };
    parameters.forEach((parameter) => {
      let name: string;
      if (parameter.target.type === 'call_expression') {
        name = (parameter.target.value as Value).value as string;
      } else {
        name = parameter.target.value as string;
      }
      if (names.includes(name)) {
        let nameCount = updatedCount[name];
        updatedCount[name] = nameCount + 1;
        name = name + `(${nameCount + 1})`;
        if (parameter.target.type === 'call_expression') {
          (parameter.target.value as Value).value = name;
        } else {
          parameter.target.value = name;
        }
      } else {
        names.push(name);
        updatedCount[name] = 1;
      }
    });
    setCount(updatedCount);
    return parameters;
  };

  const handleParameterFileChange = async () => {
    if (parameterFile) {
      const possibleInitiators: Initiator[] = [];
      const allData: any[] = [];
      const lines = (await parameterFile.text()).split(/\n/);
      for (const line of lines) {
        if (/^[0-9]{3}/.test(line)) {
          try {
            const data: any = parameterParser(line, {
              locations: true,
            });
            allData.push(data);
            if (data.value === 'T') {
              possibleInitiators.push(data);
            }
          } catch (err) {
            console.log('Error parsing line:', line, ' err is: ', err);
          }
        }
      }
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        possibleInitiators,
      }));
      console.log('parameter file data: ', allData);
    }
  };
  return (
    <>
      {isValid ? (
        <Box display={'flex'} flexDirection={'column'}>
          <TextFieldComponent value={exePath} label="Executable Path" setValue={setExePath} />

          <FileUploadComponent label="Parameter File" setFile={setParameterFile} />

          <TextFieldComponent
            value={parameterPath}
            label="Parameter File Path"
            setValue={setParameterPath}
          />

          <FileUploadComponent label="Input File" setFile={setInputFile} />

          <TextFieldComponent value={inputPath} label="Input File Path" setValue={setInputPath} />

          <Divider sx={{ my: 3 }} />

          <Box>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
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
