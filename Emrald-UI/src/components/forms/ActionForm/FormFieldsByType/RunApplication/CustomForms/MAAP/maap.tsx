import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import InputParse from './Parser';
import { parse as parameterParser } from './Parser/maap-par-parser';
import { useActionFormContext } from '../../../../ActionFormContext';
import useRunApplication from '../../useRunApplication';
import { MAAPToString } from './Parser/maap-to-string';
import type {
  MAAPParameter,
  MAAPConditionalBlockStatement,
  MAAPSourceElement,
  MAAPAssignment,
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

  function createMaapFile() {
    if (formData?.sourceElements) {
      let newSource: MAAPSourceElement[] = [];
      let cidx = -1;
      formData.sourceElements.forEach((se, i) => {
        if (se.type === 'block') {
          if (se.blockType === 'PARAMETER CHANGE' && formData.parameters) {
            // This is set up with the assumption we're only modifying assignment statements in the parameter change section
            newSource.push({
              type: 'block',
              blockType: 'PARAMETER CHANGE',
              value: [...formData.parameters, ...se.value.filter((v) => v.type !== 'assignment')],
              comments: [[], []],
            });
          } else if (formData.initiators) {
            newSource.push({
              type: 'block',
              blockType: 'INITIATORS',
              value: formData.initiators,
              comments: [[], []],
            });
          } else {
            newSource.push(se);
          }
        } else if (se.type === 'conditional_block' && cidx < 0) {
          cidx = i;
        } else if (se.type !== 'conditional_block') {
          newSource.push(se);
        }
      });
      if (formData.inputBlocks) {
        newSource = [
          ...newSource.slice(0, cidx),
          ...formData.inputBlocks,
          ...newSource.slice(cidx),
        ];
      }
      const inpFile = new MAAPToString({
        type: 'program',
        value: newSource,
        comments: [[], []],
      });
      // Ensures that variable selections are locked in
      formData.sourceElements = newSource;
      console.log(inpFile.output);
      setCodeVariables(inpFile.variables);
      return inpFile.output;
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
            inputPath: cleanInputPath,
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
                  value: data.value,
                  type: 'parameter',
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

          const parameters: MAAPSourceElement[] = [];
          let initiators: MAAPSourceElement[] = [];
          const inputBlocks: MAAPConditionalBlockStatement[] = [];
          const fileRefs: string[] = [];

          data.value.forEach((sourceElement) => {
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
                  inputBlocks.push(sourceElement);
                }
                break;
              default:
                break;
            }
          });

          // Set state variables or perform other actions with comments, sections, and parameters
          const newParameters: MAAPAssignment[] = [];
          parameters.forEach((param) => {
            if (param.type === 'assignment') {
              newParameters.push(param);
            } else {
              // Unhandled in the form UI
              console.warn(
                `Unhandled parameter format: ${new MAAPToString().sourceElementToString(param)}`,
              );
            }
          });

          setFormData((prevFormData) =>
            prevFormData
              ? {
                  ...prevFormData,
                  parameters: newParameters,
                  initiators,
                  inputBlocks,
                  fileRefs,
                  sourceElements: data.value,
                  needsUpgrade: false
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

        {formData?.needsUpgrade ? (
          <Typography fontWeight="bold">
            Your project was created in an older version of the MAAP form. Please re-open your .INP
            file.
          </Typography>
        ) : (
          <>
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
          </>
        )}
      </Box>
    </>
  );
};

export default MAAP;
