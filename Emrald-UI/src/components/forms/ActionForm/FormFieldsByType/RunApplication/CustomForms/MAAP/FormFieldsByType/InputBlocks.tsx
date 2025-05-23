import { Autocomplete, Box, Divider, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import useRunApplication from '../../../useRunApplication';
import { appData } from '../../../../../../../../hooks/useAppData';
import { MAAPFormData, MAAPConditionalBlockStatement, MAAPAssignment, MAAPIdentifier } from '../../../../../../../../types/EMRALD_Model';

const InputBlocks = () => {
  const [inputBlocks, setInputBlocks] = useState<MAAPConditionalBlockStatement[]>([]);
  const [numBooleanExpressions, setNumBooleanExpressions] = useState<{ [key: string]: number }>({});
  const [leftExpressionNames, setLeftExpressionNames] = useState<string[][]>([]);
  const [rightExpressionNames, setRightExpressionNames] = useState<string[][]>([]);
  const [operators, setOperators] = useState<{ [key: string]: string[] }>({});
  const { formData, setFormData } = useCustomForm();
  const { results, setResults } = useRunApplication();

  const maapForm = formData as MAAPFormData;
  const variables = appData.value.VariableList.map(({ name }) => name);

  const getResults = (block: MAAPConditionalBlockStatement, forCode?: boolean) => {
    // Get the existing Map or initialize a new one for the block.id
    let items = results[block.id as string] || new Map<string, string>();

    block.value.forEach((result, i) => {
      if (result.type === 'comment') {
        // Handle comments here if necessary
        let previousResult = block.value[i - 1];
        previousResult.comment = result.value as string;
      } else if (result.type === 'assignment') {
        const target = result.target.type === 'identifier' ? result.target : result.target.value;
        const name = target.value;
        const useVariable = target.useVariable;
        const args =
          result.target.type === 'call_expression' ? result.target.arguments[0].value : '';
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
    });

    // Update the state with the new Map
    setResults((prev) => ({ ...prev, [block.id as string]: new Map(items) }));
    return items;
  };

  const getResultValue = (result: MAAPAssignment, forCode?: boolean): string => {
    if (result.value.type === 'expression') {
      return `${result.value.value.left.value} ${result.value.value.op} ${result.value.value.right.value}`;
    }
    let toReturn = result.value.value as string;
    if (forCode && result.value.useVariable) {
      toReturn = `" + ${toReturn} + @"`;
    }
    return toReturn;
  };

  /** goes through the test portion of a conditional block and returns an array of each name in the block test */
  const getAllItems = (block: MAAPConditionalBlockStatement, returnType = 'items'): any[] => {
    let allItems = [];
    let operators = [];
    let iterator = block.test;
    while (iterator.type === 'expression') {
      allItems.push(iterator.value.left);
      operators.push(iterator.value.op);
      if (iterator.value.right.type !== 'expression') {
        allItems.push(iterator.value.right);
        break;
      } else {
        iterator = iterator.value.right;
      }
    }
    return returnType === 'items' ? allItems : operators;
  };

  const returnInputBlockItemNameInTest = (item: any, forCode?: boolean): string => {
    if (item === undefined) {
      return '';
    }
    if (item.type === 'call_expression') {
      const value = item.value.value;
      const args = item.arguments;
      return args ? `${value}(${String(args[0].value)})` : String(value);
    }
    if (forCode && item.useVariable) {
      return `" + ${String(item.value)} + @"`;
    }
    return String(item.value);
  };

  useEffect(() => {
    maapForm?.inputBlocks?.forEach((block) => {
      if (!numBooleanExpressions[block.id as string]) {
        const count = getNumBooleanCount(block);
        setNumBooleanExpressions((prev) => ({ ...prev, [block.id as string]: count }));

        const leftNames: string[] = [];
        const rightNames: string[] = [];
        for (let i = 0; i < count; i++) {
          const leftName = getLeftOrRightName(block, true, i);
          const rightName = getLeftOrRightName(block, false, i);

          leftNames.push(leftName);
          rightNames.push(rightName);
        }

        setLeftExpressionNames((prev) => [...prev, leftNames]);
        setRightExpressionNames((prev) => [...prev, rightNames]);
      }
      let blockOperators = getAllItems(block, 'operators');
      setOperators((prev) => ({ ...prev, [block.id as string]: blockOperators }));
      getResults(block);
    });
    setInputBlocks(maapForm?.inputBlocks || []);
  }, []);

  const getNumBooleanCount = (block: MAAPConditionalBlockStatement): number => {
    const allItems = getAllItems(block);
    return allItems.length / 2;
  };

  const getLeftOrRightName = (
    block: MAAPConditionalBlockStatement,
    isLeft: boolean,
    count = 0,
  ): string => {
    const targetIndex = 2 * count + (isLeft ? 0 : 1);
    let allItems = getAllItems(block);
    const item = allItems[targetIndex];

    return returnInputBlockItemNameInTest(item);
  };

  const handleAutocompleteChange = (
    block: any,
    newValue: string,
    isLeft: boolean,
    isProperty = false,
    propertyIndex = 0,
  ) => {
    const useVariable = variables.includes(newValue);
    const updatedBlocks = inputBlocks.map((b) => {
      if (b === block) {
        const updatedBlock = { ...b };

        if (isProperty) {
          let properties = updatedBlock.value.filter((item: any) => item.type !== 'comment');
          let property = properties[propertyIndex];
          if (isLeft && property.type === 'assignment') {
            if (property.target.type === 'identifier') {
              property.target.value = newValue;
              property.target.useVariable = useVariable;
            } else {
              property.target.value.value = newValue;
              property.target.value.useVariable = useVariable;
            }
          } else {
            const value: MAAPIdentifier = {
              type: 'identifier',
              value: newValue,
              useVariable: useVariable,
            };
            property.value = value;
          }
        } else {
          // handle left or right side property change here based on propertyIndex
          let current: any = updatedBlock.test.value;
          for (let i = 0; i < propertyIndex; i++) {
            current = current.right.value.right.value;
          }
          if (isLeft) {
            current.left.value = newValue;
            current.left.type = 'identifier';
            current.left.useVariable = useVariable;
          } else {
            current.right.value = newValue;
            current.right.type = 'identifier';
            current.right.useVariable = useVariable;
          }
        }
        return updatedBlock;
      }
      return b;
    });

    setInputBlocks(updatedBlocks);
    setFormData((prevFormData: MAAPFormData) => {
      const data: MAAPFormData = { ...prevFormData, inputBlocks: updatedBlocks };
      return data;
    });
  };

  const getOperator = (block: MAAPConditionalBlockStatement, isBoolean: boolean, count = 0): string => {
    let tempOperators = operators[block.id as string];
    tempOperators = isBoolean
      ? tempOperators.filter((op) => op === 'AND' || op === 'OR')
      : tempOperators.filter((op) => op !== 'AND' && op !== 'OR');
    return tempOperators[count];
  };

  return (
    <>
      {inputBlocks.map((block, blockInd) => {
        const count = numBooleanExpressions[block.id as string] || 0;
        let itemIndexes = [];
        for (let i = 0; i < count; i++) {
          itemIndexes.push(i);
        }
        return (
          <Box key={block.id}>
            <Typography m={2}>
              {maapForm?.docComments ? maapForm?.docComments[block.id as string]?.value : ''}
            </Typography>
            {itemIndexes.map((index) => {
              const leftName = leftExpressionNames[blockInd][index];
              const rightName = rightExpressionNames[blockInd][index];
              const leftNameOptions = variables.includes(leftName)
                ? [leftName, ...variables.filter((v) => v !== leftName)]
                : [leftName, ...variables];
              const rightNameOptions = variables.includes(rightName)
                ? [rightName, ...variables.filter((v) => v !== rightName)]
                : [rightName, ...variables];
              return (
                <Box key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography fontWeight={600} fontSize={18} mr={2}>
                      When
                    </Typography>
                    <Autocomplete
                      aria-label="When Condition Left Hand Side"
                      size="small"
                      disablePortal
                      options={leftNameOptions}
                      defaultValue={leftName}
                      onChange={(_, newValue) => {
                        if (newValue) handleAutocompleteChange(block, newValue, true, false, index);
                      }}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                      renderOption={(props, option) => (
                        <>
                          {option === leftName ? (
                            <>
                              <Box component="li" {...props}>
                                {option}
                              </Box>
                              <Divider />
                            </>
                          ) : (
                            <Box component="li" {...props}>
                              {option}
                            </Box>
                          )}
                        </>
                      )}
                    />
                    <Typography fontWeight={600} fontSize={18} sx={{ px: 3 }}>
                      {getOperator(block, false, index)}
                    </Typography>
                    <Autocomplete
                      aria-label="When Condition Right Hand Side"
                      size="small"
                      disablePortal
                      options={rightNameOptions}
                      defaultValue={rightName}
                      onChange={(_, newValue) => {
                        if (newValue)
                          handleAutocompleteChange(block, newValue, false, false, index);
                      }}
                      sx={{ width: 300 }}
                      renderInput={(params) => <TextField {...params} />}
                      renderOption={(props, option) => (
                        <>
                          {option === rightName ? (
                            <>
                              <Box component="li" {...props}>
                                {option}
                              </Box>
                              <Divider />
                            </>
                          ) : (
                            <Box component="li" {...props}>
                              {option}
                            </Box>
                          )}
                        </>
                      )}
                    />
                  </Box>
                  {count > 1 && index !== count - 1 ? (
                    <Typography sx={{ fontWeight: 'bold' }}>{getOperator(block, true)}</Typography>
                  ) : (
                    <>
                      <Box sx={{ backgroundColor: '#f5f5f5', m: 3 }}>
                        {results[block.id as string] &&
                          Array.from(results[block.id as string].entries()).map(
                            ([key, value], idx) => (
                              <Box key={idx} m={4}>
                                <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
                                  <Autocomplete
                                    aria-label="Assignment Left Hand Side"
                                    defaultValue={String(key)}
                                    size="small"
                                    options={
                                      variables.includes(String(key))
                                        ? [
                                            String(key),
                                            ...variables.filter((v) => v !== String(key)),
                                          ]
                                        : [String(key), ...variables]
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} value={params} />
                                    )}
                                    sx={{ width: 200, m: 2 }}
                                    onChange={(_, newValue) =>
                                      handleAutocompleteChange(
                                        block,
                                        newValue || '',
                                        true,
                                        true,
                                        idx,
                                      )
                                    }
                                    renderOption={(props, option) => (
                                      <>
                                        {option === String(key) ? (
                                          <>
                                            <Box component="li" {...props}>
                                              {option}
                                            </Box>
                                            <Divider />
                                          </>
                                        ) : (
                                          <Box component="li" {...props}>
                                            {option}
                                          </Box>
                                        )}
                                      </>
                                    )}
                                  />{' '}
                                  <Typography sx={{ margin: 3, fontWeight: 'bold' }}>=</Typography>{' '}
                                  <Autocomplete
                                    aria-label="Assignment Right Hand Side"
                                    defaultValue={String(value)}
                                    size="small"
                                    sx={{ width: 200, m: 2 }}
                                    options={
                                      variables.includes(String(value))
                                        ? [
                                            String(value),
                                            ...variables.filter((v) => v !== String(value)),
                                          ]
                                        : [String(value), ...variables]
                                    }
                                    renderInput={(params) => (
                                      <TextField {...params} value={params} />
                                    )}
                                    onChange={(_, newValue) =>
                                      handleAutocompleteChange(
                                        block,
                                        newValue || '',
                                        false,
                                        true,
                                        idx,
                                      )
                                    }
                                    renderOption={(props, option) => (
                                      <>
                                        {option === String(value) ? (
                                          <>
                                            <Box component="li" {...props}>
                                              {option}
                                            </Box>
                                            <Divider />
                                          </>
                                        ) : (
                                          <Box component="li" {...props}>
                                            {option}
                                          </Box>
                                        )}
                                      </>
                                    )}
                                  />
                                  {block.value[idx].comment && (
                                    <Box
                                      sx={{
                                        flex: '1 1 40%',
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Typography m={2}>{block.value[idx].comment}</Typography>
                                    </Box>
                                  )}
                                </div>
                              </Box>
                            ),
                          )}
                      </Box>
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </>
  );
};

export default InputBlocks;
