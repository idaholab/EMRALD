import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import InputParse from './Parser';
import { parse as parameterParser } from './Parser/maap-par-parser.ts';
import { v4 as uuid } from 'uuid';
import { useActionFormContext } from '../../../../ActionFormContext.tsx';
import { Initiator, Parameter } from './MAAPTypes.ts';
import useRunApplication from '../../useRunApplication.tsx';
import {
  callExpressionToString,
  expressionToString,
  expressionTypeToString,
  identifierToString,
  MAAPToString,
  sourceElementToString,
} from './Parser/maap-to-string.ts';
import { ConditionalBlockStatement, SourceElement, Comment } from 'maap-inp-parser';
import { MAAPParameter } from 'maap-par-parser';

export type MAAPFormData =
  | undefined
  | {
      exePath?: string;
      sourceElements?: SourceElement[];
      parameters?: Parameter[];
      initiators?: Initiator[];
      inputBlocks?: ConditionalBlockStatement[];
      fileRefs?: string[];
      inputFile?: File | null;
      inputPath?: string;
      parameterFile?: File | null;
      parameterPath?: string;
      possibleInitiators?: MAAPParameter[];
      docComments?: Record<string, Comment>;
      docLinkVariable?: string;
      output?: string;
    };

const MAAP = () => {
  const { formData, setFormData, setReturnProcess, ReturnPostCode, ReturnExePath } =
    useCustomForm();
  const { setReqPropsFilled, setCodeVariables } = useActionFormContext();
  const [parameterFile, setParameterFile] = useState<File | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [parameterPath, setParameterPath] = useState(formData?.parameterPath || '');
  const [inputPath, setInputPath] = useState(formData?.inputPath || '');
  const { ReturnPreCode } = useRunApplication();

  const maapForm = formData as MAAPFormData;

  useEffect(() => {
    setReqPropsFilled(!!maapForm?.exePath && !!parameterPath && !!inputPath);
  }, [formData.exePath, parameterPath, inputPath]);

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  const getParameterName = (row: SourceElement) => {
    if (row.type === 'assignment') {
      if (row.target.type === 'call_expression') {
        return callExpressionToString(row.target);
      }
      return identifierToString(row.target);
    }
    return '';
  };

  function createMaapFile() {
    if (maapForm?.sourceElements) {
      let inpFile = '';
      let block = 0;
      let variables: string[] = [];
      maapForm.sourceElements.forEach((sourceElement) => {
        if (sourceElement.type === 'block') {
          if (sourceElement.blockType === 'PARAMETER CHANGE') {
            inpFile += 'PARAMETER CHANGE\n';
            maapForm.parameters?.forEach((parameter) => {
              inpFile += `${parameter.name} = `;
              if (parameter.useVariable && typeof parameter.variable === 'string') {
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
            maapForm.initiators?.forEach((initiator) => {
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
        } else if (
          sourceElement.type === 'conditional_block' &&
          maapForm.inputBlocks !== undefined
        ) {
          const cblock = maapForm.inputBlocks[block];
          inpFile += `${cblock.blockType} `;
          if (cblock.test.type === 'expression') {
            if (
              cblock.test.value.right.useVariable &&
              typeof cblock.test.value.right.value === 'string'
            ) {
              // TODO: This may not work for every possible case
              inpFile += `${expressionTypeToString(cblock.test.value.left)} ${
                cblock.test.value.op
              } " + ${cblock.test.value.right.value} + @"\n`;
              if (variables.indexOf(cblock.test.value.right.value) < 0) {
                variables.push(cblock.test.value.right.value);
              }
            } else {
              inpFile += `${expressionToString(cblock.test)}\n`;
            }
          }
          cblock.value.forEach((se) => {
            if (se.type === 'assignment' && se.value.useVariable) {
              if (se.target.type === 'call_expression') {
                inpFile += callExpressionToString(se.target);
              } else {
                inpFile += identifierToString(se.target);
              }
              inpFile += ` = \" + ${se.value.value} + @\"`;
            } else {
              inpFile += sourceElementToString(se);
            }
          });
          inpFile += `\nEND\n`;
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
    const cleanExePath = getCleanPath(maapForm?.exePath || '');
    const cleanParameterPath = getCleanPath(parameterPath);
    const cleanInputPath = getCleanPath(inputPath);
    ReturnPreCode(`string exeLoc = "${cleanExePath}";
        string paramLoc = "${cleanParameterPath}";
        string inpLoc = "${cleanInputPath}";
        string newInp = @"${createMaapFile()}";
        string fileRefs = "${maapForm?.fileRefs}"; //example "PVGS_502.par, test.txt";
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
        if (File.Exists(paramLoc) && !File.Exists(Path.Join(tempLoc, Path.GetFileName(paramLoc))))
        {
          File.Copy(paramLoc, Path.Join(tempLoc, Path.GetFileName(paramLoc)));
        }
        
        string paramFileName = Path.GetFileName(paramLoc);
        string inpFileName = Path.GetFileName(inpLoc);
        string inpLocPath = Path.GetDirectoryName(inpLoc);
        foreach (string fileRef in fileRefsList)
        {
          string fileRefPath = Path.Join(inpLocPath, fileRef);
          if (File.Exists(fileRefPath) && !File.Exists(Path.Join(tempLoc, fileRef)))
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
        if (File.Exists(exeLoc) && !File.Exists(Path.Join(tempLoc, exeName)))
        {
          File.Copy(exeLoc, Path.Join(tempLoc, exeName));
        }
        string dllPath = Path.Join(Path.GetDirectoryName(exeLoc), exeName[..^7] + ".dll");
        if (File.Exists(dllPath) && !File.Exists(Path.Join(tempLoc, Path.GetFileName(dllPath))))
        {
          File.Copy(dllPath, Path.Join(tempLoc, Path.GetFileName(dllPath)));
        }
        
        string newInpLoc = Path.Join(tempLoc, inpFileName);
        System.IO.File.WriteAllText(newInpLoc, newInp);
        return $"{Path.Join(tempLoc, exeName)} {inpFileName} {paramFileName}";`);
    ReturnExePath('');
    ReturnPostCode(`string inpLoc = @"${cleanInputPath}";
  if (!Path.IsPathRooted(inpLoc))
        inpLoc = RootPath + inpLoc;
    string docVarPath = @"./MAAP/temp.log";
  if (!Path.IsPathRooted(docVarPath))
        docVarPath = RootPath + docVarPath;
  string resLoc = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "EMRALD_MAAP", Path.GetFileNameWithoutExtension(inpLoc) + ".log");
  Directory.CreateDirectory(Path.GetDirectoryName(docVarPath));
  File.Copy(resLoc, docVarPath, true);`);

    setReturnProcess('rtNone');

    const newFormdata: MAAPFormData = {
      ...maapForm,
      exePath: cleanExePath,
      inputFile,
      inputPath: cleanInputPath,
      parameterFile,
      parameterPath: cleanParameterPath,
    };
    setFormData(newFormdata);
  }, [inputPath, parameterFile, parameterPath, JSON.stringify(formData)]);

  useEffect(() => {
    if (parameterFile) {
      const possibleInitiators: MAAPParameter[] = [];
      parameterFile.text().then((lineData) => {
        const lines = lineData.split(/\n/);
        for (const line of lines) {
          if (/^[0-9]{3}/.test(line)) {
            try {
              const data = parameterParser(line, {}) as MAAPParameter;
              if (data.value === 'T') {
                possibleInitiators.push({
                  index: data.index,
                  desc: data.desc,
                  comment: data.comment,
                  value: data.value,
                });
              }
            } catch (err) {
              console.log('Error parsing line:', line, ' err is: ', err);
            }
          }
        }
      });
      setFormData((prevFormData: MAAPFormData) => {
        const newData: MAAPFormData = {
          ...prevFormData,
          possibleInitiators,
        };
        return newData;
      });
    }
  }, [parameterFile, setParameterFile]);

  useEffect(() => {
    const handleInputFileChange = async () => {
      if (inputFile) {
        const fileString = await inputFile.text();
        try {
          const data = InputParse.parse(fileString, { locations: false }).output;

          let docComments: Record<string, Comment> = {};
          let parameters: SourceElement[] = [];
          let initiators: SourceElement[] = [];
          let inputBlocks: ConditionalBlockStatement[] = [];
          let fileRefs: string[] = [];

          data.value.forEach((sourceElement, i) => {
            if (sourceElement.type === 'comment') {
              // get following source element and see if it is a conditional block
              let nextElement = data.value[i + 1];
              if (nextElement && nextElement.type === 'conditional_block') {
                if (!inputBlocks.includes(nextElement)) {
                  nextElement.id = uuid();
                  inputBlocks.push(nextElement);
                }
                docComments[nextElement.id as string] = sourceElement;
              }
            }

            switch (sourceElement.type) {
              case 'file':
                if (sourceElement.fileType) {
                  fileRefs.push(sourceElement.value);
                }
                break;
              case 'block':
                if (sourceElement.blockType === 'PARAMETER CHANGE') {
                  sourceElement.value.forEach((innerElement) => {
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
              default:
                break;
            }
          });

          // Set state variables or perform other actions with comments, sections, and parameters
          // setComments(comments);
          const newParameters: Parameter[] = [];
          parameters.forEach((param) => {
            if (param.type === 'comment') {
              newParameters[newParameters.length - 1].comment = param.value as unknown as string;
            } else {
              let unit = '';
              let value: string | number | boolean = '';
              if (
                typeof param.value === 'object' &&
                !Array.isArray(param.value) &&
                param.type === 'assignment'
              ) {
                if (param.value.type === 'number') {
                  value = param.value.value;
                  unit = param.value.units || '';
                }
              }
              newParameters.push({
                name: getParameterName(param),
                id: uuid(),
                useVariable: false,
                unit,
                value,
              });
            }
          });
          const newInitiators: Initiator[] = [];
          initiators.forEach((init) => {
            if (init.type === 'comment') {
              newInitiators[newInitiators.length - 1].comment = init.value as string;
            } else if (init.type === 'assignment') {
              let value: string | number | boolean = '';
              if (init.value.type === 'boolean') {
                value = init.value.value;
              } else if (init.value.type === 'number') {
                value = init.value.value;
              } else {
                value = expressionToString(init.value);
              }
              newInitiators.push({
                name: getParameterName(init),
                id: uuid(),
                comment: '',
                value,
              });
            }
          });
          setFormData((prevFormData: MAAPFormData) => {
            const newData: MAAPFormData = {
              ...prevFormData,
              parameters: newParameters,
              initiators: newInitiators,
              docComments,
              inputBlocks,
              fileRefs,
              sourceElements: data.value,
            };
            return newData;
          });
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
        <TextFieldComponent
          value={formData.exePath}
          label="MAAP Executable Path"
          setValue={(value) => {
            setFormData({
              ...formData,
              exePath: value,
            });
          }}
        />

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
