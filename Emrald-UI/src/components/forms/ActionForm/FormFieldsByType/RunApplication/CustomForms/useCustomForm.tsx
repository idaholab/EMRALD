import { useMemo, useState } from 'react';
import { useActionContext } from '../../../../../../contexts/ActionContext';
import { useDiagramContext } from '../../../../../../contexts/DiagramContext';
import { useEventContext } from '../../../../../../contexts/EventContext';
import { useLogicNodeContext } from '../../../../../../contexts/LogicNodeContext';
import { useStateContext } from '../../../../../../contexts/StateContext';
import { useVariableContext } from '../../../../../../contexts/VariableContext';
import { useActionFormContext } from '../../../ActionFormContext';
import { getParameterName } from './MAAP/FormFieldsByType/Parameters';
import { Alias, getInitiatorName, InputBlock, InputResultValue, Test, Value } from './MAAP/maap';
import { getAllItems, returnInputBlockItemNameInTest } from './MAAP/FormFieldsByType/InputBlocks';

export function useCustomForm() {
  const {
    diagramList: { value: diagrams },
  } = useDiagramContext();
  const {
    logicNodeList: { value: logicNodes },
  } = useLogicNodeContext();
  const {
    actionsList: { value: actions },
  } = useActionContext();
  const {
    eventsList: { value: events },
  } = useEventContext();
  const {
    statesList: { value: states },
  } = useStateContext();
  const {
    variableList: { value: variables },
  } = useVariableContext();
  const {
    formData,
    codeVariables,
    exePath,
    setFormData,
    setExePath,
    setMakeInputFileCode,
    setProcessOutputFileCode,
    setCodeVariables,
  } = useActionFormContext();
  const [preCodeUsed, setPreCodeUsed] = useState(false);
  const [postCodeUsed, setPostCodeUsed] = useState(false);
  const [exePathUsed, setExePathUsed] = useState(false);
  const [codeVariablesUsed, setCodeVariablesUsed] = useState(false);
  const [parameterPath, setParameterPath] = useState('');
  const [inputPath, setInputPath] = useState('');
  const [results, setResults] = useState<{ [key: string]: Map<string, string> }>({});
  // ... get data from other contexts

  const resetUseCode = () => {
    setMakeInputFileCode('');
    setProcessOutputFileCode('');
    // setExePath('');
    setCodeVariables(codeVariables);
  };

  const isValid = useMemo(() => {
    if (!preCodeUsed || !postCodeUsed || !exePathUsed || !codeVariablesUsed) {
      resetUseCode();
    }
    return preCodeUsed && postCodeUsed && exePathUsed && codeVariablesUsed;
  }, [preCodeUsed, postCodeUsed, exePathUsed, codeVariablesUsed]);

  const ReturnPreCode = () => {
    setMakeInputFileCode(createPreProcessCode());
    setPreCodeUsed(true);
  };

  const ReturnPostCode = (postCode: string) => {
    setProcessOutputFileCode(postCode);
    setPostCodeUsed(true);
  };

  const ReturnExePath = (path: string) => {
    setExePath(path);
    setExePathUsed(true);
  };

  const ReturnUsedVariables = (variableName: string) => {
    if (!codeVariables.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables.filter((item) => item !== variableName));
    }
    setCodeVariablesUsed(true);
  };
  const getAliasStrings = () => {
    let aliasString = '';
    const aliases: Alias[] = formData?.aliasList;
    if (aliases) {
      for (const alias of aliases) {
        aliasString = aliasString + `\t${getAliasName(alias)} AS ${alias.value.value}\n`;
      }
    }
    return aliasString;
  };
  const getAliasName = (alias: Alias) => {
    let name =
      alias.target.type === 'call_expression'
        ? ((alias.target.value as Value).value as string)
        : (alias.target.value as string);
    if (alias.target?.arguments && alias.target.arguments.length > 0) {
      name = name + `(${String(alias.target.arguments[0].value)})`;
    }
    return name || '';
  };
  const getInitiatorStrings = () => {
    let initiatorString = '';
    const initiators = formData?.initiators;
    if (initiators) {
      for (const initiator of initiators) {
        initiatorString =
          initiatorString + `\t${getInitiatorName(initiator)} = ${initiator.value.value}\n`;
      }
    }
    return initiatorString;
  };
  const getInputBlockStrings = () => {
    let inputBlockString = '';
    const inputBlocks = formData?.inputBlocks;
    if (inputBlocks) {
      for (const inputBlock of inputBlocks) {
        inputBlockString =
          inputBlockString +
          `\nWHEN ${getInputBlockTest(inputBlock)}\n${getInputBlockResults(inputBlock)}END\n`;
      }
    }
    return inputBlockString;
  };
  const getInputBlockTest = (inputBlock: InputBlock) => {
    let testString = '';
    const allItems = getAllItems(inputBlock);
    const allOperators = getAllItems(inputBlock, 'operators');
    for (let i = 0; i < allItems.length; i++) {
      testString =
        testString +
        returnInputBlockItemNameInTest(allItems[i]) +
        ' ' +
        (i !== allItems.length - 1 ? allOperators[i] : '') +
        ' ';
    }
    return testString;
  };
  const getInputBlockResults = (inputBlock: InputBlock) => {
    let resultsString = '';
    const resultList = getResults(inputBlock);
    for (const [key, value] of resultList) {
      resultsString = resultsString + `\t${key} = ${value}\n`;
    }
    return resultsString;
  };
  const getResults = (block: InputBlock) => {
    // Get the existing Map or initialize a new one for the block.id
    let items = results[block.id] || new Map<string, string>();

    block.value.forEach((result: InputResultValue) => {
      if (result.type === 'comment') {
        // Handle comments here if necessary
      } else {
        if (result.target && result.target.type) {
          const name =
            result.target.type === 'identifier'
              ? result.target.value
              : (result.target.value as Value).value;
          const args = result.target.arguments ? result.target.arguments[0].value : '';
          const fullName = args ? `${name}(${String(args)})` : String(name);

          // Get the value associated with the result
          const value = getResultValue(result);

          // Add the key-value pair to the Map if it doesn't already exist
          if (!items.has(fullName) || items.get(fullName) !== value) {
            items.set(fullName, value);
          }
        }
      }
    });

    // Update the state with the new Map
    setResults((prev) => ({ ...prev, [block.id]: new Map(items) }));
    return items;
  };

  const getResultValue = (result: InputResultValue): string => {
    if ((result.value as Value).type === 'expression') {
      return `${(result.value as Test).value.left.value} ${(result.value as Test).value.op} ${
        (result.value as Test).value.right.value
      }`;
    }
    return result.value.value as string;
  };
  const getFinalStatements = () => {
    return '';
  };
  const createMaapFile = (): string => {
    return `
TITLE\n\t${formData?.title}\nEND\nPARAMETER CHANGE\n${getParameterStrings()}END\nALIAS\n${getAliasStrings()}END\nINITIATORS\n${getInitiatorStrings()}END\n${getInputBlockStrings()}${getFinalStatements()}END`;
  };
  const getParameterStrings = (): string => {
    let parameterString = '';
    const parameters = formData?.parameters;
    if (parameters) {
      for (const parameter of parameters) {
        parameterString =
          parameterString +
          `\t${getParameterName(parameter)} = ${
            parameter.useVariable ? `" + ${parameter.variable} + @"` : parameter.value.value
          }\n`;
      }
    }
    return parameterString;
  };
  const createPreProcessCode = () => {
    return `
string exeLoc = "${exePath}";
string paramLoc = "${parameterPath}";
string inpLoc = "${inputPath}";
string newInp = @"${createMaapFile()}";
string fileRefs = "${formData?.fileRefs}"; //example "PVGS_502.par, test.txt";
string[] fileRefsList = fileRefs.Split(',');

if (!Path.IsPathRooted(exeLoc))
{
  exeLoc = System.IO.Directory.GetCurrentDirectory() + exeLoc;
}
if (!Path.IsPathRooted(paramLoc))
{
  paramLoc = System.IO.Directory.GetCurrentDirectory() + paramLoc;
}
if (!Path.IsPathRooted(inpLoc))
{
  inpLoc = System.IO.Directory.GetCurrentDirectory() + inpLoc;
}

string tempLoc = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData) + @"\EMRALD_MAAP\";
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
  File.Copy(paramLoc, tempLoc + Path.GetFileName(paramLoc));
}

string paramFileName = Path.GetFileName(paramLoc);
string inpLocPath = Path.GetDirectoryName(inpLoc) + Path.DirectorySeparatorChar;
foreach (string fileRef in fileRefsList)
{
  if (File.Exists(inpLocPath + fileRef))
  {
if(fileRef != paramFileName)
  File.Copy(inpLocPath + fileRef, tempLoc + fileRef);
  }
  else
  {
Console.WriteLine("Missing MAAP referenced file - " + inpLocPath + fileRef);
  }
}
string exeName = Path.GetFileName(exeLoc);
if (File.Exists(exeLoc))
{
  File.Copy(exeLoc, tempLoc + exeName);
}
string dllPath = Path.GetDirectoryName(exeLoc) + @"\" + exeName.Substring(0, exeName.Length - 7) + ".dll";
if (File.Exists(dllPath))
{
  File.Copy(dllPath, tempLoc + Path.GetFileName(dllPath));
}

System.IO.File.WriteAllText(tempLoc + Path.GetFileName(inpLoc), newInp);
return tempLoc + exeName + " " + Path.GetFileName(inpLoc) + " " + Path.GetFileName(paramLoc);
`;
  };

  return {
    formData,
    isValid,
    diagrams,
    logicNodes,
    actions,
    events,
    states,
    variables,
    parameterPath,
    inputPath,
    exePath,
    results,
    createPreProcessCode,
    setExePath,
    setInputPath,
    setFormData,
    ReturnPreCode,
    ReturnPostCode,
    ReturnExePath,
    ReturnUsedVariables,
    setParameterPath,
    setResults,
    getResults,
  };
}
