import { useState } from 'react';
import { useActionFormContext } from '../../ActionFormContext';
import {
  Alias,
  Initiator,
  InputBlock,
  InputResultValue,
  Parameter,
  Target,
  Test,
  Value,
} from './CustomApplicationTypes';

const useRunApplication = () => {
  const { formData, exePath, setMakeInputFileCode } = useActionFormContext();
  const [preCodeUsed, setPreCodeUsed] = useState(false);
  const [parameterPath, setParameterPath] = useState(formData?.parameterPath || '');
  const [inputPath, setInputPath] = useState(formData?.inputPath || '');
  const [results, setResults] = useState<{ [key: string]: Map<string, string> }>({});

  const getParameterName = (row: Parameter) => {
    let name =
      row.target.type === 'call_expression'
        ? ((row.target.value as Value).value as string)
        : (row.target.value as string);
    if (row.target?.arguments && row.target.arguments.length > 0) {
      name = name + `(${String(row.target.arguments[0].value)})`;
    }
    return name;
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
  const createMaapFile = (): string => {
    return `
    TITLE\n\t${formData?.title}\nEND\nPARAMETER CHANGE\n${getParameterStrings()}END\nALIAS\n${getAliasStrings()}END\nINITIATORS\n${getInitiatorStrings()}END\n${getInputBlockStrings()}${getFinalStatements()}END`;
  };
  const ReturnPreCode = () => {
    setMakeInputFileCode(createPreProcessCode());
    setPreCodeUsed(true);
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
  const getInitiatorName = (row: Initiator): string | number => {
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

    block.value.forEach((result: InputResultValue, i: number) => {
      if (result.type === 'comment') {
        // Handle comments here if necessary
        let previousResult = block.value[i - 1];
        previousResult.comment = result.value as string;
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
    return (result.value as Value).value as string;
  };
  const getFinalStatements = () => {
    return '';
  };
  /** goes through the test portion of a conditional block and returns an array of each name in the block test */
  const getAllItems = (block: InputBlock, returnType = 'items'): any[] => {
    let allItems = [];
    let operators = [];
    let iterator = block.test;
    while (isTest(iterator as Test)) {
      allItems.push(iterator.value.left);
      operators.push(iterator.value.op);
      if (!isTest(iterator.value.right as Test)) {
        allItems.push(iterator.value.right);
        break;
      } else {
        iterator = iterator.value.right as Test;
      }
    }
    return returnType === 'items' ? allItems : operators;
  };

  const isTest = (test: Test): boolean => {
    return !!test?.value?.left && !!test?.value?.right;
  };

  const returnInputBlockItemNameInTest = (item: any): string => {
    if ((item as Value).type === 'call_expression') {
      const value = (item.value as Value).value;
      const args = (item as Target).arguments;
      return args ? `${value}(${String(args[0].value)})` : String(value);
    }

    return String(item.value) || '';
  };
  return {
    preCodeUsed,
    parameterPath,
    inputPath,
    results,
    getResults,
    ReturnPreCode,
    getParameterName,
    getInitiatorName,
    getAllItems,
    isTest,
    returnInputBlockItemNameInTest,
    setParameterPath,
    setInputPath,
    setResults,
  };
};

export default useRunApplication;
