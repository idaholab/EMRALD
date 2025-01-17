import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import { parse as InputParse } from './Parser/maap-inp-parser.ts';
import { parse as parameterParser } from './Parser/maap-par-parser.ts';
import { v4 as uuid } from 'uuid';
import { useActionFormContext } from '../../../../ActionFormContext.tsx';
import {
  Initiator,
  InitiatorOG,
  InputBlock,
  Parameter,
  ParameterOG,
  Value,
} from '../../CustomApplicationTypes.ts';
import useRunApplication from '../../useRunApplication.tsx';

const MAAP = () => {
  const {
    formData,
    exePath,
    setExePath,
    setFormData,
    ReturnPostCode,
    ReturnExePath,
  } = useCustomForm();
  const { setReqPropsFilled } = useActionFormContext();
  const [parameterFile, setParameterFile] = useState<File | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const {
    parameterPath,
    inputPath,
    getParameterName,
    getInitiatorName,
    ReturnPreCode,
    setParameterPath,
    setInputPath,
  } = useRunApplication();

  useEffect(() => {
    setReqPropsFilled(!!exePath && !!parameterPath && !!inputPath);
  }, [exePath, parameterPath, inputPath]);

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  useEffect(() => {
    ReturnPreCode();
    ReturnExePath(exePath);
    ReturnPostCode(`string inpLoc = @"${inputPath}";
  if (!Path.IsPathRooted(inpLoc))
        inpLoc = RootPath + inpLoc;
    string docVarPath = @".\\MAAP\\temp.log";
  if (!Path.IsPathRooted(docVarPath))
        docVarPath = RootPath + docVarPath;
  string resLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\EMRALD_MAAP\" + Path.GetFileNameWithoutExtension(inpLoc) + ".log";
  File.Copy(resLoc, docVarPath, true);`);

    setFormData({
      ...formData,
      exePath,
      inputFile,
      inputPath,
      parameterFile,
      parameterPath,
    });
  }, [inputPath, parameterFile, parameterPath]);

  useEffect(() => {
    if (parameterFile) {
      const parameterFileName = parameterFile.name;
      if (!parameterPath) {
        setParameterPath('.\\' + parameterFileName);
      } else {
        let tempPath = parameterPath;
        let sections = tempPath.split(/[\\/]/);
        sections[sections.length - 1] = parameterFileName;
        setParameterPath(sections.join('\\'));
      }
      const possibleInitiators: Initiator[] = [];
      const allData: any[] = [];
      parameterFile.text().then((lineData) => {
        const lines = lineData.split(/\n/);
        for (const line of lines) {
          if (/^[0-9]{3}/.test(line)) {
            try {
              const data: any = parameterParser(line, {});
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
          setInputPath('.\\' + inputFileName);
        } else {
          let tempPath = inputPath;
          let sections = tempPath.split(/[\\/]/);
          sections[sections.length - 1] = inputFileName;
          setInputPath(sections.join('\\'));
        }
        const fileString = await inputFile.text();
        try {
          const data = InputParse(fileString, {});

          console.log('input file data: ', data.value);

          let docComments: { [key: string]: InputBlock } = {};
          let sections: any = [];
          let parameters: any = [];
          let initiators: any = [];
          let inputBlocks: InputBlock[] = [];
          let title: string;
          let fileRefs: any = [];
          let aliasList: any[] = [];
          let isExpressions: any = [];
          let plotFil: any;

          data.value.forEach((sourceElement: any, i: any) => {
            if (sourceElement.type === 'comment') {
              // get following source element and see if it is a conditional block
              let nextElement = data.value[i + 1];
              if (nextElement && nextElement.type === 'conditional_block') {
                if (!inputBlocks.includes(nextElement)) {
                  nextElement.id = uuid();
                  inputBlocks.push(nextElement);
                }
                docComments[nextElement.id] = sourceElement;
              }
            } else {
              sections.push(sourceElement);
            }

            switch (sourceElement.type) {
              case 'title':
                title = sourceElement.value;
                break;
              case 'file':
                if (sourceElement.fileType) {
                  fileRefs.push(sourceElement.value);
                }
                break;
              case 'alias':
                sourceElement.value.forEach((element: any) => {
                  aliasList.push(element);
                });
                break;
              case 'block':
                if (sourceElement.blockType === 'PARAMETER CHANGE') {
                  sourceElement.value.forEach((innerElement: any) => {
                    parameters.push(innerElement);
                  });
                } else if (sourceElement.blockType === 'INITIATORS') {
                  const initiatorData = sourceElement.value;
                  for (let i = 0; i < initiatorData.length; i++) {
                    initiators.push(initiatorData[i]);
                  }
                }
                break;
              case 'conditional_block':
                if (!inputBlocks.includes(sourceElement)) {
                  sourceElement.id = uuid();
                  inputBlocks.push(sourceElement);
                }
                break;
              case 'is_expression':
                isExpressions.push(sourceElement);
                break;
              case 'plotfil':
                plotFil = sourceElement;
                break;
              default:
                break;
            }
          });

          // Set state variables or perform other actions with comments, sections, and parameters
          // setComments(comments);
          const newParameters: Parameter[] = [];
          parameters.forEach((param: ParameterOG) => {
            if (param.type === 'comment') {
              newParameters[newParameters.length - 1].comment = param.value as unknown as string;
            } else {
              newParameters.push({
                name: getParameterName(param) || '',
                id: uuid(),
                useVariable: false,
                value: param.value.value,
                variable: '',
              });
            }
          });
          const newInitiators: Initiator[] = [];
          initiators.forEach((init: InitiatorOG) => {
            if (init.type === 'comment') {
              newInitiators[newInitiators.length - 1].comment = init.value as string;
            } else {
              newInitiators.push({
                name: String(getInitiatorName(init)),
                id: uuid(),
                comment: '',
                value: (init.value as Value).value,
              });
            }
          });
          setFormData((prevFormData: any) => ({
            ...prevFormData,
            parameters: newParameters,
            initiators: newInitiators,
            docComments,
            inputBlocks,
            inputFileName,
            title,
            fileRefs,
            aliasList,
            isExpressions,
            plotFil,
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
      <Box display={'flex'} flexDirection={'column'}>
        <TextFieldComponent value={exePath} label="MAAP Executable Path" setValue={setExePath} />

        <FileUploadComponent
          label="Parameter File"
          setFile={setParameterFile}
          fileName={parameterFile?.name}
          accept='.par'
          clearFile={() => {
            setParameterFile(null);
          }}
        />

        <TextFieldComponent
          value={parameterPath}
          label="Parameter File Path"
          setValue={setParameterPath}
        />

        <FileUploadComponent
          label="Input File"
          setFile={setInputFile}
          fileName={inputFile?.name}
          accept='.inp'
          clearFile={() => {
            setInputFile(null);
          }}
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
    </>
  );
};

export default MAAP;
