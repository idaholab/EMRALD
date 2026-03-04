import React, { useEffect, useState } from 'react';
import { useCustomForm } from '../useCustomForm';
import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import { TextFieldComponent, FileUploadComponent, TabPanel } from '../../../../../../common';
import { Parameters, Initiators, InputBlocks, Outputs } from './FormFieldsByType';
import { parser } from './Parser';
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
  const { formData, setFormData, setReturnProcess, ReturnPreCode, ReturnPostCode, ReturnExePath } =
    useCustomForm();
  const { setReqPropsFilled, setCodeVariables } = useActionFormContext();
  const [parameterFile, setParameterFile] = useState<File | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [parameterPath, setParameterPath] = useState(formData?.parameterPath ?? '');
  const [inputPath, setInputPath] = useState(formData?.inputPath ?? '');
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

    ReturnPreCode(`string paramLoc = "${cleanParameterPath}";
      string inpLoc = "${cleanInputPath}";
      string exeName = Path.GetFileName(ExePath);
      string paramFileName = Path.GetFileName(paramLoc);
      string inpFileName = Path.GetFileName(inpLoc);

      string newInp = @"${createMaapFile()}";

      string fileRefs = "${(formData?.fileRefs ?? []).join(',')}";
      string[] fileRefsList = fileRefs.Split(',');
      // Trim whitespace from each element
      for (int i = 0; i < fileRefsList.Length; i++)
      {
          fileRefsList[i] = fileRefsList[i].Trim();
      }


      //get tempLoc for non vs multiThreaded and copy files needed for each
      string tempLoc = "";
      if(MultiThreaded)
      {
	      //temp location is the RootPath variable + Relative of OrigRootPath to the Exe location, if multi threaded as everything is relative to that 
	      string relativeExePath = Path.GetRelativePath(OrigRootPath, ExePath);
	      string relativeExeDir = Path.GetDirectoryName(relativeExePath);
	      while (relativeExeDir.StartsWith("../") || relativeExeDir.StartsWith("..\\\\"))
		      relativeExeDir = relativeExeDir.Substring(3);
	      tempLoc = Path.GetFullPath(Path.Join(RootPath, relativeExeDir));
      }
      else
      {
	      //if not multiThreaded create a appData folder to copy the MAAP files to run
	      tempLoc = Path.Join(
		      Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
		      "EMRALD_MAAP"
	      );
	      try
	      {
		      if (Directory.Exists(tempLoc))
		      {
			      Directory.Delete(tempLoc, true);
		      }

		      Directory.CreateDirectory(tempLoc);
	      }
	      catch (Exception ex)
	      {
		      Console.WriteLine($"Error creating working directory: {ex.Message}");
              throw;
	      }
      }

      //copy exe file
      string newExePath = Path.Join(tempLoc, exeName);
      if (File.Exists(ExePath))
      {
	      if (!File.Exists(newExePath))
		      File.Copy(ExePath, newExePath); 
      }
      else
	      Console.WriteLine("Missing MAAP exe file - " + ExePath); 

      //copy the MAAP dll
      string dllPath = Path.Join(Path.GetDirectoryName(ExePath), exeName[..^7] + ".dll");
      if (File.Exists(dllPath))
      {
	      string copyToPath = Path.GetFullPath(Path.Join(tempLoc, Path.GetFileName(dllPath)));
	      if(!File.Exists(copyToPath))
            File.Copy(dllPath, copyToPath);
      }
      else
	      Console.WriteLine("Missing MAAP dll file - " + dllPath);

      //copy the MAAP parameter file
      string fullParamLoc = paramLoc;
      if (!Path.IsPathRooted(paramLoc))
      {
          fullParamLoc = Path.GetFullPath(Path.Join(OrigRootPath, paramLoc));
      }
      if (File.Exists(fullParamLoc))
      {
	      string copyToPath = Path.Join(tempLoc, paramFileName);
	      File.Copy(fullParamLoc, copyToPath, true); 
      }
      else
	      Console.WriteLine("Missing MAAP input file - " + fullParamLoc);
	
      //copy the new input file
      string newInpLoc = Path.Join(tempLoc, inpFileName);
      File.WriteAllText(newInpLoc, newInp);

      //Get the old input file location to copy other used files
      string copyFromRoot = inpLoc;
      if (!Path.IsPathRooted(copyFromRoot))
      {
          copyFromRoot = Path.GetFullPath(Path.Join(OrigRootPath, copyFromRoot));
	      copyFromRoot = Path.GetDirectoryName(fullParamLoc);
      }
      foreach (string fileRef in fileRefsList)
      {
          string fileFromPath = Path.GetFullPath(Path.Join(copyFromRoot, fileRef));
	      string copyToPath = Path.GetFullPath(Path.Join(tempLoc, fileRef));

          if (File.Exists(fileFromPath))
	      {		
		      if(!File.Exists(copyToPath))
			      File.Copy(fileFromPath, copyToPath);
	      }
          else
              Console.WriteLine("Missing MAAP referenced file - " + fileFromPath);
      }

      //all files are in same location as MAAP EXE so just return the file names
      return $"{newExePath} {inpFileName} {paramFileName}";`);

    ReturnExePath(formData?.exePath ?? '');

    ReturnPostCode(`string inpLoc = @"${cleanInputPath}"; 
      string neededResults = @".inp,.log,.D59";
      //only need to copy results when not running multi threaded so document variable have correct path. if multithreaded this is taken care of.
      if(!MultiThreaded)
      {
          string sourceDir = Path.Join(
		      Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
		      "EMRALD_MAAP"
	      );
	      if (!Directory.Exists(sourceDir))
            throw new Exception("MAAP source folder not found - " + sourceDir);
	
          // Copy .inp, .log, and .D59 to inpLoc which is RootPath + ../MAAPFiles/
	      if (!Path.IsPathRooted(inpLoc))
		      inpLoc = Path.GetFullPath(Path.Join(RootPath, inpLoc));	
	      string maapFilesPath = Path.GetDirectoryName(inpLoc);
	      if(!Directory.Exists(maapFilesPath))
		      throw new Exception("MAAP results destination folder invalid - " + maapFilesPath);
	
	      string baseFileName = Path.GetFileNameWithoutExtension(inpLoc);
        
	      string[] maapFilesExtensions = neededResults.Split(',', StringSplitOptions.RemoveEmptyEntries);
	      foreach (string ext in maapFilesExtensions)
	      {
		      string sourceFile = Path.Combine(sourceDir, baseFileName + ext);
		      string destFile = Path.Combine(maapFilesPath, baseFileName + ext);
		
		      if (File.Exists(sourceFile))
		      {
			      File.Copy(sourceFile, destFile, true);
		      }
          }
      }`);

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
          const data = parser.parse(fileString, { locations: false }).output;

          const parameters: MAAPSourceElement[] = [];
          let initiators: MAAPSourceElement[] = [];
          const inputBlocks: MAAPConditionalBlockStatement[] = [];
          const fileRefs: string[] = [];

          data?.value.forEach((sourceElement) => {
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
                  sourceElements: data?.value,
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
