import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import { parse as InputParse } from './Parser/maap-inp-parser.ts';
import { parse as parameterParser } from './Parser/maap-par-parser.ts';
import { v4 as uuid } from 'uuid';
import { useActionFormContext } from '../../../../ActionFormContext.tsx';

export interface ParameterOG {
  location: any;
  target: Target;
  value: Value;
  type: string;
}
export interface Target {
  location: any;
  value: Value | string;
  type: string;
  arguments?: argument[];
}

export interface argument {
  value: string | number;
  type: string;
  units?: string;
}

export interface Value {
  type: string;
  value: string | number;
  units?: string;
}
export interface Initiator {
  desc: string;
  value: string;
  index: number;
  type: string;
  target: Target;
}
export interface Parameter {
  useVariable: boolean;
  id: string;
  location: any;
  target: Target;
  value: Value;
  type: string;
  variable?: string;
}
interface InputBlockOG {
  test: Test;
  value: InputResultValue[];
}
export interface InputBlock {
  test: Test;
  value: InputResultValue[];
  id: string;
}
export interface Test {
  value: InputValue;
}
export interface InputValue {
  left: Value | Target | Test;
  right: Value | Target | Test;
  op: string;
}
export interface InputResultValue {
  location: any;
  target: Target;
  type: string;
  value: Value | Test;
}

export const getInitiatorName = (row: Initiator): string | number => {
  let name =
    row.type === 'assignment'
      ? row.target.type === 'identifier'
        ? (row.target.value as string | number)
        : ((row.target.value as Value).value as string | number)
      : (row.desc as string);
  if (row.target?.arguments && row.target.arguments.length > 0) {
    name = name + ` (${String(row.target.arguments[0].value)})`;
  }
  return name;
};

const MAAP = () => {
  const {
    formData,
    isValid,
    parameterPath,
    inputPath,
    exePath,
    setExePath,
    setInputPath,
    setFormData,
    ReturnPreCode,
    ReturnPostCode,
    ReturnUsedVariables,
    ReturnExePath,
    setParameterPath,
  } = useCustomForm();
  const { setReqPropsFilled } = useActionFormContext();
  const [parameterFile, setParameterFile] = useState<File | null>();

  const [inputFile, setInputFile] = useState<File | null>();

  const [currentTab, setCurrentTab] = React.useState(0);

  useEffect(() => {
    setReqPropsFilled(!!exePath && !!parameterPath && !!inputPath);
  }, [exePath, parameterPath, inputPath]);

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  const createPreProcessCode = () => {
    return `string inpLoc = @"${inputPath}";`;
  };

  useEffect(() => {
    setParameterPath(formData?.parameterPath || '');
    setExePath(formData?.exePath || '');
    setInputPath(formData?.inputPath || '');
  }, []);

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
    if (parameterFile) {
      const parameterFileName = parameterFile.name;
      if (!parameterPath) {
        setParameterPath(parameterFileName);
      }
      const possibleInitiators: Initiator[] = [];
      const allData: any[] = [];
      parameterFile.text().then((lineData) => {
        const lines = lineData.split(/\n/);
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
      });
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        possibleInitiators,
        parameterFileName,
      }));
      console.log('parameter file data: ', allData);
    }
  }, [parameterFile, setParameterFile]);

  useEffect(() => {
    const handleInputFileChange = async () => {
      if (inputFile) {
        const inputFileName = inputFile.name;
        if (!inputPath) {
          setInputPath(inputFileName);
        }
        const fileString = await inputFile.text();
        try {
          const data = InputParse(fileString, {
            locations: true,
          });

          console.log('input file data: ', data.value);

          let docComments: any = [];
          let comments: any = {};
          let sections: any = [];
          let parameters: any = [];
          let initiators: any = [];
          let inputBlocks: any = [];

          data.value.forEach((sourceElement: any, i: any) => {
            if (sourceElement.type === 'comment') {
              docComments.push(sourceElement);
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
                  const initiatorData = sourceElement.value;
                  for (let i = 0; i < initiatorData.length; i++) {
                    if (initiatorData[i].type === 'comment') {
                      if (i === 0) continue;
                      comments[getInitiatorName(initiatorData[i - 1])] = initiatorData[i].value;
                    } else {
                      initiators.push(initiatorData[i]);
                    }
                  }
                }
                break;
              case 'conditional_block':
                inputBlocks.push(sourceElement);
                break;
              default:
                break;
            }
          });

          // Set state variables or perform other actions with comments, sections, and parameters
          // setComments(comments);
          const newParameters: Parameter[] = parameters.map((param: ParameterOG) => ({
            ...param,
            id: uuid(),
            useVariable: false,
          }));
          const newInputBlocks: InputBlock[] = inputBlocks.map((block: InputBlockOG) => ({
            ...block,
            id: uuid(),
          }));
          setFormData((prevFormData: any) => ({
            ...prevFormData,
            parametersOG: parameters, // storing original parameters without any added properties just in case
            parameters: newParameters,
            initiators,
            comments,
            docComments,
            inputBlocksOG: inputBlocks, // storing original input blocks without any added properties just in case
            inputBlocks: newInputBlocks,
            inputFileName,
          }));
        } catch (err) {
          console.log('Error parsing file:', err);
        }
      }
    };
    handleInputFileChange();
  }, [inputFile, setInputFile]);

  return (
    <>
      {isValid ? (
        <Box display={'flex'} flexDirection={'column'}>
          <TextFieldComponent value={exePath} label="Executable Path" setValue={setExePath} />

          <FileUploadComponent
            label="Parameter File"
            setFile={setParameterFile}
            fileName={formData.parameterFileName}
          />

          <TextFieldComponent
            value={parameterPath}
            label="Parameter File Path"
            setValue={setParameterPath}
          />

          <FileUploadComponent
            label="Input File"
            setFile={setInputFile}
            fileName={formData.inputFileName}
          />

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
