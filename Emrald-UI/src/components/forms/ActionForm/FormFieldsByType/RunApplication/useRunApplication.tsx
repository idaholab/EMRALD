import { useState } from 'react';
import { useActionFormContext } from '../../ActionFormContext';
import {
  Alias,
  Initiator,
  InitiatorOG,
  InputBlock,
  InputResultValue,
  Parameter,
  ParameterOG,
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
    TITLE\n\t${formData?.title}\nEND\nPARAMETER CHANGE\n${getParameterStrings()}END\nALIAS\n${getAliasStrings()}END\nINITIATORS\n${getInitiatorStrings()}END\n${getInputBlockStrings()}\n${getIsExpressions()}\n${getPlotFil()}\nEND`;
  };
  const ReturnPreCode = () => {
    setMakeInputFileCode(createPreProcessCode());
    setPreCodeUsed(true);
  };
  const getParameterStrings = (): string => {
    let parameterString = '';
    const parameters: Parameter[] = formData?.parameters;
    if (parameters) {
      for (const parameter of parameters) {
        parameterString += `\t${parameter.name} = ${
          parameter.useVariable ? `" + ${parameter.variable} + @"` : parameter.value
        }${parameter.comment ? ` // ${parameter.comment}` : ''}\n`;
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
    const initiators: Initiator[] = formData?.initiators;
    if (initiators) {
      for (const initiator of initiators) {
        initiatorString =
          initiatorString +
          `\t${initiator.name} = ${initiator.value} ${
            initiator.comment ? ` // ${initiator.comment}` : ''
          }\n`;
      }
    }
    return initiatorString;
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
  const getInputBlockStrings = () => {
    let inputBlockString = '';
    const inputBlocks: InputBlock[] = formData?.inputBlocks;
    if (inputBlocks) {
      for (const inputBlock of inputBlocks) {
        const comment = formData.docComments[inputBlock.id]?.value;
        inputBlockString =
          inputBlockString +
          `\n${comment ? `// ${comment}\n` : ''}WHEN ${getInputBlockTest(
            inputBlock,
          )}\n${getInputBlockResults(inputBlock)}END\n`;
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
        returnInputBlockItemNameInTest(allItems[i], true) +
        ' ' +
        (i !== allItems.length - 1 ? allOperators[i] : '') +
        ' ';
    }
    return testString;
  };
  const getInputBlockResults = (inputBlock: InputBlock) => {
    let resultsString = '';
    const resultList = getResults(inputBlock, true);
    let idx = 0;
    for (const [key, value] of resultList) {
      resultsString =
        resultsString +
        `\t${key} = ${value} ${
          inputBlock.value[idx].comment ? ` // ${inputBlock.value[idx].comment} ` : ''
        }\n`;
      idx += 1;
    }
    return resultsString;
  };
  const getResults = (block: InputBlock, forCode?: boolean) => {
    // Get the existing Map or initialize a new one for the block.id
    let items = results[block.id] || new Map<string, string>();

    block.value.forEach((result: InputResultValue, i: number) => {
      if (result.type === 'comment') {
        // Handle comments here if necessary
        let previousResult = block.value[i - 1];
        previousResult.comment = result.value as string;
      } else {
        if (result.target && result.target.type) {
          const target =
            result.target.type === 'identifier' ? result.target : (result.target.value as Value);
          const name = target.value;
          const useVariable = target.useVariable;
          const args = result.target.arguments ? result.target.arguments[0].value : '';
          let fullName = args ? `${name}(${String(args)})` : String(name);
          if (forCode && useVariable) {
            fullName = `" + ${fullName} + @"`;
          }

          // Get the value associated with the result
          const value = getResultValue(result, forCode);

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
  const getResultValue = (result: InputResultValue, forCode?: boolean): string => {
    if ((result.value as Value).type === 'expression') {
      return `${(result.value as Test).value.left.value} ${(result.value as Test).value.op} ${
        (result.value as Test).value.right.value
      }`;
    }
    let toReturn = (result.value as Value).value as string;
    if (forCode && (result.value as Value).useVariable) {
      toReturn = `" + ${toReturn} + @"`;
    }
    return toReturn;
  };
  const getIsExpressions = (): string => {
    let toReturn = '';
    const isExpressions = formData?.isExpressions;
    if (isExpressions) {
      for (const expression of isExpressions) {
        toReturn = toReturn + expression.target.value + ' IS ' + expression.value.value + '\n\t';
      }
    }
    return toReturn;
  };
  const getPlotFil = (): string => {
    let toReturn = '';
    const plotFil = formData?.plotFil;
    if (plotFil) {
      toReturn = 'PLOTFIL ' + plotFil.n + '\n';
      for (const row of plotFil.value) {
        for (const element of row) {
          toReturn =
            toReturn +
            (element.type !== 'call_expression'
              ? element.value
              : element.value.value + (element.arguments && `(${element.arguments[0].value})`)) +
            '\n'; // fix this because it wont work with all of them -- ZWDC2SG(1)
        }
      }
    }
    return toReturn;
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

  const returnInputBlockItemNameInTest = (item: any, forCode?: boolean): string => {
    if (item === undefined) {
      return '';
    }
    if ((item as Value).type === 'call_expression') {
      const value = (item.value as Value).value;
      const args = (item as Target).arguments;
      return args ? `${value}(${String(args[0].value)})` : String(value);
    }
    if (forCode && item.useVariable) {
      return `" + ${String(item.value)} + @"`;
    }

    return String(item.value);
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
