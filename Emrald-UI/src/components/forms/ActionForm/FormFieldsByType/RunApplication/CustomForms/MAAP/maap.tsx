import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import InputParse from './Parser';
import { parse as parameterParser } from './Parser/maap-par-parser';
import { v4 as uuid } from 'uuid';
import { useActionFormContext } from '../../../../ActionFormContext';
import useRunApplication from '../../useRunApplication';
import {
  callExpressionToString,
  expressionBlockToString,
  expressionToString,
  expressionTypeToString,
  identifierToString,
  isExpressionToString,
  MAAPToString,
  sourceElementToString,
  variableToString,
} from './Parser/maap-to-string';
import type {
  MAAPParameter,
  MAAPConditionalBlockStatement,
  MAAPSourceElement,
  MAAPComment,
  MAAPInitiator,
} from '../../../../../../../types/EMRALD_Model';

const MAAP = () => {
  const { formData, setFormData, setReturnProcess, ReturnPostCode, ReturnExePath } =
    useCustomForm();
  const { setReqPropsFilled, setCodeVariables } = useActionFormContext();
  const [parameterFile, setParameterFile] = useState<File | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [parameterPath, setParameterPath] = useState(formData?.parameterPath ?? '');
  const [inputPath, setInputPath] = useState(formData?.inputPath ?? '');
  const { ReturnPreCode } = useRunApplication();

  useEffect(() => {
    setReqPropsFilled(!!formData?.exePath && !!parameterPath && !!inputPath);
  }, [formData?.exePath, parameterPath, inputPath]);

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  const getParameterName = (row: MAAPSourceElement) => {
    if (row.type === 'assignment') {
      if (row.target.type === 'call_expression') {
        return callExpressionToString(row.target);
      }
      return identifierToString(row.target);
    }
    return '';
  };

  function createMaapFile() {
    if (formData?.sourceElements) {
      let inpFile = '';
      let block = 0;
      const variables: string[] = [];
      formData.sourceElements.forEach((sourceElement) => {
        if (sourceElement.type === 'block') {
          if (sourceElement.blockType === 'PARAMETER CHANGE') {
            inpFile += 'PARAMETER CHANGE\n';
            formData.parameters?.forEach((parameter) => {
              inpFile += `${parameter.name ?? ''} = `;
              if (parameter.useVariable && typeof parameter.variable === 'string') {
                inpFile += `" + ${parameter.variable} + @"`;
                if (!variables.includes(parameter.variable)) {
                  variables.push(parameter.variable);
                }
              } else {
                if (typeof parameter.value === 'string') {
                  inpFile += parameter.value;
                } else if (parameter.value.type === 'parameter_name') {
                  inpFile += parameter.value.value;
                } else {
                  inpFile += expressionToString(parameter.value);
                }
                if (parameter.unit) {
                  inpFile += ` ${parameter.unit}`;
                }
              }
              inpFile += '\n';
            });
            inpFile += 'END\n';
          } else {
            inpFile += 'INITIATORS\n';
            formData.initiators?.forEach((initiator) => {
              inpFile += `${initiator.name} = `;
              if (typeof initiator.value === 'boolean') {
                inpFile += initiator.value ? 'T' : 'F';
              } else {
                inpFile += initiator.value.toString();
              }
              inpFile += '\n';
            });
            inpFile += 'END\n';
          }
        } else if (
          sourceElement.type === 'conditional_block' &&
          formData.inputBlocks !== undefined
        ) {
          const cblock = formData.inputBlocks[block];
          inpFile += `${cblock.blockType} `;
          if (cblock.test.type === 'expression') {
            console.log(cblock);
            if (cblock.test.value.left.useVariable) {
              // TODO - If this is set to a variable, can the right value be anything other than a string?
              if (typeof cblock.test.value.left.value === 'string') {
                inpFile += `" + ${cblock.test.value.left.value} + @"`;
                if (!variables.includes(cblock.test.value.left.value)) {
                  variables.push(cblock.test.value.left.value);
                }
              }
            } else {
              inpFile += `${expressionTypeToString(cblock.test.value.left)} ${cblock.test.value.op} `;
            }
            if (cblock.test.value.right.useVariable) {
              // TODO - If this is set to a variable, can the right value be anything other than a string?
              if (typeof cblock.test.value.right.value === 'string') {
                inpFile += cblock.test.value.right.value;
                if (!variables.includes(cblock.test.value.right.value)) {
                  variables.push(cblock.test.value.right.value);
                }
              }
              inpFile += ' + @"\n';
            } else {
              inpFile += `${expressionToString(cblock.test.value.right)}\n`;
            }
          } else if (cblock.test.type === 'is_expression') {
            if (cblock.test.target.useVariable) {
              // TODO - If this is set to a variable, can the right value be anything other than a string?
              if (typeof cblock.test.target.value === 'string') {
                inpFile += `" + ${cblock.test.target.value} + @" IS `;
                if (!variables.includes(cblock.test.target.value)) {
                  variables.push(cblock.test.target.value);
                }
              }
            } else {
              inpFile += `${variableToString(cblock.test.target)} IS `;
            }
            if (cblock.test.value.useVariable) {
              // TODO - If this is set to a variable, can the right value be anything other than a string?
              if (typeof cblock.test.value.value === 'string') {
                inpFile += `" + ${cblock.test.value.value} + @"`;
                if (!variables.includes(cblock.test.value.value)) {
                  variables.push(cblock.test.value.value);
                }
              }
            } else {
              if (typeof cblock.test.value.value === 'string') {
                inpFile += cblock.test.value.value;
              } else if (
                typeof cblock.test.value.value === 'number' ||
                typeof cblock.test.value.value === 'boolean'
              ) {
                inpFile += cblock.test.value.value.toString();
              } else if (cblock.test.value.type === 'is_expression') {
                inpFile += isExpressionToString(cblock.test.value);
              } else if (cblock.test.value.type === 'call_expression') {
                inpFile += callExpressionToString(cblock.test.value);
              } else if (cblock.test.value.type === 'expression') {
                inpFile += expressionToString(cblock.test.value);
              } else {
                inpFile += expressionBlockToString(cblock.test.value);
              }
            }
            inpFile += '\n';
          }
          // TODO: Looking at the other possible syntax object types that cblock.test can be, I don't think any of them are actually possible
          // But if they are, add them in an else if statement here
          cblock.value.forEach((se) => {
            if (se.type === 'assignment' && se.value.useVariable) {
              if (se.target.type === 'call_expression') {
                inpFile += callExpressionToString(se.target);
              } else {
                inpFile += identifierToString(se.target);
              }
              inpFile += ` = " + ${expressionToString(se.value)} + @"`;
            } else {
              inpFile += sourceElementToString(se);
            }
            inpFile += '\n';
          });
          inpFile += `\nEND\n`;
          block += 1;
        } else {
          inpFile += `${MAAPToString(sourceElement)}\n`;
        }
      });
      setCodeVariables(variables);
      console.log(inpFile);
      return inpFile;
    }
    return '';
  }

  useEffect(() => {
    const getCleanPath = (path: string) =>
      path.replace(/\\/g, '/').replace(/^"/, '').replace(/"$/, '');
    const cleanExePath = getCleanPath(formData?.exePath ?? '');
    const cleanParameterPath = getCleanPath(parameterPath);
    const cleanInputPath = getCleanPath(inputPath);
    ReturnPreCode(`string exeLoc = "${cleanExePath}";
        string paramLoc = "${cleanParameterPath}";
        string inpLoc = "${cleanInputPath}";
        string newInp = @"${createMaapFile()}";
        string fileRefs = "${(formData?.fileRefs ?? []).join(',')}"; //example "PVGS_502.par, test.txt";
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
    setFormData(
      formData
        ? {
            ...formData,
            exePath: cleanExePath,
            inputFile,
            inputPath: cleanInputPath,
            parameterFile,
            parameterPath: cleanParameterPath,
          }
        : undefined,
    );
  }, [inputPath, parameterFile, parameterPath, JSON.stringify(formData)]);

  useEffect(() => {
    const handleParameterFileChange = async () => {
      if (parameterFile) {
        const possibleInitiators: MAAPParameter[] = [];

        const lineData = await parameterFile.text();
        const lines = lineData.split(/\n/);
        for (const line of lines) {
          if (/^[0-9]{3}/.test(line)) {
            try {
              const data = parameterParser(line, {}) as MAAPParameter;
              if (data.value === 'T') {
                possibleInitiators.push({
                  index: data.index,
                  desc: data.desc,
                  comment: data.comment ?? '',
                  value: data.value,
                  type: 'parameter',
                  id: uuid(),
                });
              }
            } catch (err) {
              console.log('Error parsing line:', line, ' err is: ', err);
            }
          }
        }
        setFormData((prevFormData) =>
          prevFormData
            ? {
                ...prevFormData,
                possibleInitiators,
              }
            : undefined,
        );
      }
    };
    void handleParameterFileChange();
  }, [parameterFile, setParameterFile]);

  useEffect(() => {
    const handleInputFileChange = async () => {
      if (inputFile) {
        const fileString = await inputFile.text();
        try {
          const data = InputParse.parse(fileString, { locations: false }).output;

          const docComments: Record<string, MAAPComment> = {};
          const parameters: MAAPSourceElement[] = [];
          let initiators: MAAPSourceElement[] = [];
          const inputBlocks: MAAPConditionalBlockStatement[] = [];
          const fileRefs: string[] = [];

          data.value.forEach((sourceElement, i) => {
            if (sourceElement.type === 'comment') {
              // get following source element and see if it is a conditional block
              const nextElement = data.value[i + 1] as MAAPComment | MAAPSourceElement | undefined;
              if (nextElement && nextElement.type === 'conditional_block') {
                if (!inputBlocks.includes(nextElement)) {
                  nextElement.id = uuid();
                  inputBlocks.push(nextElement);
                }
                docComments[nextElement.id] = sourceElement;
              }
            }

            switch (sourceElement.type) {
              case 'file':
                fileRefs.push(sourceElement.value);
                break;
              case 'block':
                if (sourceElement.blockType === 'PARAMETER CHANGE') {
                  sourceElement.value.forEach((innerElement) => {
                    parameters.push(innerElement);
                  });
                } else {
                  initiators = initiators.concat(sourceElement.value);
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
          const newParameters: MAAPParameter[] = [];
          parameters.forEach((param) => {
            if (param.type === 'comment') {
              newParameters[newParameters.length - 1].comment = param.value as unknown as string;
            } else {
              let unit = '';
              let value = '';
              if (
                typeof param.value === 'object' &&
                !Array.isArray(param.value) &&
                param.type === 'assignment'
              ) {
                if (param.value.type === 'number') {
                  value = param.value.value.toString();
                  unit = param.value.units ?? '';
                }
              }
              newParameters.push({
                name: getParameterName(param),
                id: uuid(),
                useVariable: false,
                unit,
                value,
                type: 'parameter',
              });
            }
          });
          const newInitiators: MAAPInitiator[] = [];
          initiators.forEach((init) => {
            if (init.type === 'comment') {
              newInitiators[newInitiators.length - 1].comment = init.value;
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
          setFormData((prevFormData) =>
            prevFormData
              ? {
                  ...prevFormData,
                  parameters: newParameters,
                  initiators: newInitiators,
                  docComments,
                  inputBlocks,
                  fileRefs,
                  sourceElements: data.value,
                }
              : undefined,
          );
        } catch (err) {
          console.log('Error parsing file:', err);
        }
      }
    };
    void handleInputFileChange();
  }, [inputFile, setInputFile]);

  return (
    <>
      <Box display={'flex'} flexDirection={'column'}>
        <TextFieldComponent
          value={formData?.exePath ?? ''}
          label="MAAP Executable Path"
          setValue={(value) => {
            setFormData(
              formData
                ? {
                    ...formData,
                    exePath: value,
                  }
                : undefined,
            );
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
