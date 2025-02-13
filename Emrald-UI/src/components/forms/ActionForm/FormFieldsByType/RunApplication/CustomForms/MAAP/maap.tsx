import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import { parse as InputParse } from './Parser/maap-inp-parser.ts';
import { parse as parameterParser } from './Parser/maap-par-parser.ts';
import { v4 as uuid } from 'uuid';
import { useActionFormContext } from '../../../../ActionFormContext.tsx';
import { Initiator, InitiatorOG, InputBlock, Parameter, ParameterOG, Value } from './MAAPTypes.ts';
import useRunApplication from '../../useRunApplication.tsx';
import {
  expressionToString,
  expressionTypeToString,
  MAAPToString,
  sourceElementToString,
} from './Parser/maap-to-string.ts';
import { Expression, ExpressionType, SourceElement } from 'maap-inp-parser';

// TODO: INP file is still missing SENSITIVITY ON if it is not on a new line
// TODO: The code does not update every time the form is saved

const MAAP = () => {
  const {
    formData,
    exePath,
    setExePath,
    setFormData,
    setReturnProcess,
    ReturnPostCode,
    ReturnExePath,
  } = useCustomForm();
  const { setReqPropsFilled, setCodeVariables } = useActionFormContext();
  const [parameterFile, setParameterFile] = useState<File | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [parameterPath, setParameterPath] = useState(formData?.parameterPath || '');
  const [inputPath, setInputPath] = useState(formData?.inputPath || '');
  const { ReturnPreCode } = useRunApplication();

  useEffect(() => {
    setReqPropsFilled(!!exePath && !!parameterPath && !!inputPath);
  }, [exePath, parameterPath, inputPath]);

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  const getParameterName = (row: ParameterOG) => {
    if (!row.target) return;
    let name =
      row.target.type === 'call_expression'
        ? ((row.target.value as Value).value as string)
        : (row.target.value as string);
    if (row.target?.arguments && row.target.arguments.length > 0) {
      name = name + `(${String(row.target.arguments[0].value)})`;
    }
    return name;
  };

  const getInitiatorName = (row: InitiatorOG): string | number => {
    let name = '';
    if (row.type === 'assignment') {
      if (row.target.type === 'identifier') {
        name = `${row.target.value}`;
      } else {
        name = `${(row.target.value as Value).value}`;
      }
    } else if (row.type === 'parameter_name') {
      name = `${row.value}`;
    } else {
      name = row.desc;
    }
    if (row.target?.arguments && row.target.arguments.length > 0) {
      name = name + `(${String(row.target.arguments[0].value)})`;
    }
    return name;
  };

  function createMaapFile() {
    if (formData.sourceElements) {
      let inpFile = '';
      let block = 0;
      let variables: string[] = [];
      formData.sourceElements.forEach((sourceElement: SourceElement) => {
        if (sourceElement.type === 'block') {
          if (sourceElement.blockType === 'PARAMETER CHANGE') {
            inpFile += 'PARAMETER CHANGE\n';
            formData.parameters.forEach((parameter: Parameter) => {
              inpFile += `${parameter.name} = `;
              if (parameter.useVariable) {
                inpFile += `" + ${parameter.variable} + @"`;
                if (variables.indexOf(parameter.variable) < 0) {
                  variables.push(parameter.variable);
                }
              } else {
                inpFile += `${parameter.value}`;
                if (parameter.unit) {
                  inpFile += ` ${parameter.unit}`;
                }
              }
              inpFile += '\n';
            });
            inpFile += 'END\n';
          } else if (sourceElement.blockType === 'INITIATORS') {
            inpFile += 'INITIATORS\n';
            formData.initiators.forEach((initiator: Initiator) => {
              inpFile += `${initiator.name} = `;
              if (typeof initiator.value === 'boolean') {
                inpFile += initiator.value ? 'T' : 'F';
              } else {
                inpFile += initiator.value;
              }
              inpFile += '\n';
            });
            inpFile += 'END\n';
          }
        } else if (sourceElement.type === 'conditional_block') {
          const cblock = formData.inputBlocks[block] as InputBlock;
          inpFile += `${cblock.blockType} `;
          if ((cblock.test.value.right as Value).useVariable) {
            // TODO: This may not work for every possible case
            inpFile += `${expressionTypeToString(cblock.test.value.left as ExpressionType)} ${
              cblock.test.value.op
            } " + ${cblock.test.value.right.value} + @"\n`;
            if (variables.indexOf(cblock.test.value.right.value as string) < 0) {
              variables.push(cblock.test.value.right.value as string);
            }
          } else {
            inpFile += `${expressionToString(cblock.test as Expression)}\n`;
          }
          inpFile += `${cblock.value
            .map((se) => sourceElementToString(se as SourceElement))
            .join('\n')}\nEND\n`;
          block += 1;
        } else {
          inpFile += `${MAAPToString(sourceElement)}\n`;
        }
      });
      setCodeVariables(variables);
      return inpFile;
    }
    return '';
  }

  useEffect(() => {
    const getCleanPath = (path: string) =>
      path.replace(/\\/g, '/').replace(/^\"/, '').replace(/\"$/, '');
    const cleanExePath = getCleanPath(exePath);
    const cleanParameterPath = getCleanPath(parameterPath);
    const cleanInputPath = getCleanPath(inputPath);
    ReturnPreCode(`string exeLoc = "${cleanExePath}";
        string paramLoc = "${cleanParameterPath}";
        string inpLoc = "${cleanInputPath}";
        string newInp = @"${createMaapFile()}";
        string fileRefs = "${formData?.fileRefs}"; //example "PVGS_502.par, test.txt";
        string[] fileRefsList = fileRefs.Split(',');
        
        if (!Path.IsPathRooted(exeLoc))
        {
          exeLoc = Path.Join(Directory.GetCurrentDirectory(), exeLoc);
        }
        if (!Path.IsPathRooted(paramLoc))
        {
          paramLoc = Path.Join(Directory.GetCurrentDirectory(), paramLoc);
        }
        if (!Path.IsPathRooted(inpLoc))
        {
          inpLoc = Path.Join(Directory.GetCurrentDirectory(), inpLoc);
        }
        
        string tempLoc = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "EMRALD_MAAP");
        try
        {
          if (Directory.Exists(tempLoc))
          {
            Directory.Delete(tempLoc, true);
          }
          Directory.CreateDirectory(tempLoc);
        }
        catch { }
        if (File.Exists(paramLoc))
        {
          File.Copy(paramLoc, Path.Join(tempLoc, Path.GetFileName(paramLoc)));
        }
        
        string paramFileName = Path.GetFileName(paramLoc);
        string inpLocPath = Path.GetDirectoryName(inpLoc);
        foreach (string fileRef in fileRefsList)
        {
          string fileRefPath = Path.Join(inpLocPath, fileRef);
          if (File.Exists(fileRefPath))
          {
            if (fileRef != paramFileName)
            File.Copy(fileRefPath, Path.Join(tempLoc, fileRef));
          }
          else
          {
            Console.WriteLine("Missing MAAP referenced file - " + Path.Join(inpLocPath, fileRef));
          }
        }
        string exeName = Path.GetFileName(exeLoc);
        if (File.Exists(exeLoc))
        {
          File.Copy(exeLoc, Path.Join(tempLoc, exeName));
        }
        string dllPath = Path.Join(Path.GetDirectoryName(exeLoc), exeName[..^7] + ".dll");
        if (File.Exists(dllPath))
        {
          File.Copy(dllPath, Path.Join(tempLoc, Path.GetFileName(dllPath)));
        }
        
        System.IO.File.WriteAllText(Path.Join(tempLoc, Path.GetFileName(inpLoc)), newInp);
        return tempLoc + exeName + " " + Path.GetFileName(inpLoc) + " " + Path.GetFileName(paramLoc);`);
    ReturnExePath(cleanExePath);
    ReturnPostCode(`string inpLoc = @"${cleanInputPath}";
  if (!Path.IsPathRooted(inpLoc))
        inpLoc = RootPath + inpLoc;
    string docVarPath = @"./MAAP/temp.log";
  if (!Path.IsPathRooted(docVarPath))
        docVarPath = RootPath + docVarPath;
  string resLoc = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "EMRALD_MAAP", Path.GetFileNameWithoutExtension(inpLoc) + ".log");
  File.Copy(resLoc, docVarPath, true);`);

    setReturnProcess('rtNone');

    setFormData({
      ...formData,
      exePath: cleanExePath,
      inputFile,
      inputPath: cleanInputPath,
      parameterFile,
      parameterPath: cleanParameterPath,
    });
  }, [inputPath, parameterFile, parameterPath]);

  useEffect(() => {
    if (parameterFile) {
      const parameterFileName = parameterFile.name;
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
                unit: param.value.units,
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
            sourceElements: data.value,
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
          accept=".par"
          clearFile={() => {
            setParameterFile(null);
          }}
        />

        <TextFieldComponent
          value={parameterPath}
          label="Full Parameter File Path"
          setValue={setParameterPath}
        />

        <FileUploadComponent
          label="Input File"
          setFile={setInputFile}
          fileName={inputFile?.name}
          accept=".inp"
          clearFile={() => {
            setInputFile(null);
          }}
        />

        <TextFieldComponent
          value={inputPath}
          label="Full Input File Path"
          setValue={setInputPath}
        />

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
