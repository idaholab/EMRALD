import { Editor } from '@monaco-editor/react';
import {
  Box,
  Typography,
  FormControlLabel,
  FormControl,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { type ReturnProcessType, useActionFormContext } from '../../ActionFormContext';
import { useVariableContext } from '../../../../../contexts/VariableContext';
import CodeVariables from '../../../../common/CodeVariables';
import { type ReactElement, useEffect, useState } from 'react';
import { CustomForms } from './CustomForms/index';
import { startCase } from 'lodash';
import React from 'react';
import SelectComponent from '../../../../common/SelectComponent';
import { TextFieldComponent } from '../../../../common';
import type { CustomFormType } from '../../../../../types/EMRALD_Model';

const RunApplication = () => {
  const {
    codeVariables,
    makeInputFileCode,
    exePath,
    processOutputFileCode,
    raType,
    returnProcess,
    formData,
    variableName,
    addToUsedVariables,
    setMakeInputFileCode,
    setExePath,
    setProcessOutputFileCode,
    setRaType,
    setFormData,
    setReturnProcess,
    setVariableName,
  } = useActionFormContext();

  const { variableList } = useVariableContext();
  const [applicationType, setApplicationType] = useState(raType ?? 'code');
  const [customFormType, setCustomFormType] = useState<CustomFormType | undefined>(
    formData?.caType,
  );
  const [options, setOptions] = useState<CustomFormType[]>(['MAAP']);
  const [selectedComponent, setSelectedComponent] = useState<ReactElement | null>(null);
  const [localPreCode, setLocalPreCode] = useState('');
  const [hasInitialCode, setHasInitialCode] = useState(false);

  useEffect(() => {
    setOptions(Object.keys(CustomForms) as CustomFormType[]);
  }, []);

  useEffect(() => {
    //  Set selected component when customFormType changes
    if (customFormType) {
      setSelectedComponent(React.createElement(CustomForms[customFormType]));
    } else {
      setSelectedComponent(null);
    }
  }, [customFormType]);

  useEffect(() => {
    if (!hasInitialCode) {
      setHasInitialCode(true);
      if (!makeInputFileCode || makeInputFileCode.length === 0) {
        setLocalPreCode('return ""; // return executable parameters');
      } else {
        setLocalPreCode(makeInputFileCode);
      }
    }
  });

  const handleSetCustomFormType = (value: CustomFormType) => {
    setCustomFormType(value);
    setFormData((prev) => ({ ...prev, caType: value }));
  };

  const handleApplicationTypeChange = (value: string) => {
    setApplicationType(value);
    setRaType(value);
  };

  return (
    <>
      <FormControl>
        <RadioGroup
          name="controlled-radio-buttons-group"
          value={applicationType}
          onChange={(e) => {
            handleApplicationTypeChange(e.target.value);
          }}
          row
        >
          <FormControlLabel value="code" control={<Radio />} label="Use Code" />
          <FormControlLabel value="custom" control={<Radio />} label="Use Custom Application" />
        </RadioGroup>
      </FormControl>
      {applicationType === 'code' ? (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, mr: 3, minWidth: '340px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ mb: 1 }} fontWeight={600}>
                Preprocess Code (c#)
              </Typography>
              <Editor
                height="300px"
                defaultLanguage="csharp"
                language="csharp"
                value={localPreCode}
                onChange={(value) => {
                  setMakeInputFileCode(value ?? '');
                }}
                options={{
                  minimap: { enabled: false },
                  snippetSuggestions: 'inline',
                }}
              />

              <TextFieldComponent
                label="Executable Location"
                value={exePath ?? ''}
                setValue={setExePath}
              />
              <br />
              <FormControl>
                <InputLabel>Return Type</InputLabel>
                <Select
                  label="Return Type"
                  value={returnProcess}
                  onChange={(event) => {
                    const rtType = event.target.value as ReturnProcessType;
                    setReturnProcess(rtType); // TODO: propgate the selected type to the action JSON
                    switch (rtType) {
                      case 'rtStateList':
                        setProcessOutputFileCode(
                          'List<String> retStates = new List<String>();\n//add states to exit or enter into the retStates list\n//retStates.Add("-ExitStateName");\n//retStates.Add("NewStateName");\nreturn retStates;',
                        );
                        break;
                      case 'rtVar':
                        setProcessOutputFileCode(
                          '// Return value must be the same type as the selected variable.\nreturn ; // the value to be assigned to the variable',
                        );
                        break;
                      // add template codes for other return types here
                      default:
                    }
                  }}
                >
                  <MenuItem value="rtNone">None</MenuItem>
                  <MenuItem value="rtStateList">State List</MenuItem>
                  <MenuItem value="rtVar">Variable</MenuItem>
                </Select>
              </FormControl>

              {returnProcess == 'rtVar' ? (
                <SelectComponent
                  value={variableName}
                  setValue={setVariableName}
                  label="Target Variable"
                  fullWidth
                >
                  {variableList.value.map((variable, index) => {
                    return (
                      <MenuItem value={variable.name} key={index}>
                        {variable.name}
                      </MenuItem>
                    );
                  })}
                </SelectComponent>
              ) : (
                <div></div>
              )}

              {returnProcess != 'rtNone' ? (
                <div>
                  <Typography sx={{ mt: 2, mb: 1 }} fontWeight={600}>
                    Postprocess Code (c#)
                  </Typography>
                  <Editor
                    height="300px"
                    defaultLanguage="csharp"
                    language="csharp"
                    value={processOutputFileCode}
                    onChange={(value) => {
                      setProcessOutputFileCode(value ?? '');
                    }}
                    options={{
                      minimap: { enabled: false },
                      snippetSuggestions: 'inline',
                    }}
                  />
                </div>
              ) : (
                <div></div>
              )}
            </Box>
          </Box>

          <CodeVariables
            variableList={variableList.value}
            codeVariables={codeVariables}
            addToUsedVariables={addToUsedVariables}
            height="540px"
          />
        </Box>
      ) : (
        <Box display={'flex'} flexDirection={'column'}>
          <SelectComponent
            label="Custom Application Type"
            value={customFormType ?? ''}
            setValue={(name) => {
              handleSetCustomFormType(name as CustomFormType);
            }}
          >
            {options.map((option) => (
              <MenuItem value={option} key={option}>
                {startCase(option)}
              </MenuItem>
            ))}
          </SelectComponent>

          {selectedComponent}
        </Box>
      )}
    </>
  );
};

export default RunApplication;
