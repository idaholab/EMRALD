import { Autocomplete, Box, Divider, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import { InputBlock, InputResultValue, Target, Test, Value } from '../maap';
import { appData } from '../../../../../../../../hooks/useAppData';

const InputBlocks = () => {
  const [inputBlocks, setInputBlocks] = useState<InputBlock[]>([]);
  const [numBooleanExpressions, setNumBooleanExpressions] = useState<{ [key: string]: number }>({});
  const [results, setResults] = useState<{ [key: string]: { [key: string]: string }[] }>({});
  const [leftExpressionNames, setLeftExpressionNames] = useState<string[][]>([]);
  const [rightExpressionNames, setRightExpressionNames] = useState<string[][]>([]);
  const [operators, setOperators] = useState<{ [key: string]: string[] }>({});
  const { formData, setFormData } = useCustomForm();
  const variables = appData.value.VariableList.map(({ name }) => name);

  useEffect(() => {
    formData.inputBlocks?.forEach((block: InputBlock) => {
      if (!numBooleanExpressions[block.id]) {
        const count = getNumBooleanCount(block);
        setNumBooleanExpressions((prev) => ({ ...prev, [block.id]: count }));

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
      setOperators((prev) => ({ ...prev, [block.id]: blockOperators }));
      let items = results[block.id] || [];
      block.value.forEach((result: InputResultValue) => {
        if (result.type === 'comment') {
          // handle comments here
        } else {
          if (result.target && result.target.type) {
            const name =
              result.target.type === 'identifier'
                ? result.target.value
                : (result.target.value as Value).value;
            const args = result.target.arguments ? result.target.arguments[0].value : '';
            const fullName = args ? `${name} (${String(args)})` : String(name);
            items.push({ [fullName]: getResultValue(result) });
          }
        }
      });
      setResults((prev) => ({ ...prev, [block.id]: items }));
    });
    setInputBlocks(formData?.inputBlocks || []);
  }, []);

  const getResultValue = (result: InputResultValue): string => {
    if ((result.value as Value).type === 'expression') {
      return `${(result.value as Test).value.left.value} ${(result.value as Test).value.op} ${
        (result.value as Test).value.right.value
      }`;
    }
    return result.value.value as string;
  };

  const getNumBooleanCount = (block: InputBlock): number => {
    const allItems = getAllItems(block);
    return allItems.length / 2;
  };

  const isTest = (test: Test): boolean => {
    return !!test?.value?.left && !!test?.value?.right;
  };
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

  const getLeftOrRightName = (block: InputBlock, isLeft: boolean, count = 0): string => {
    const targetIndex = 2 * count + (isLeft ? 0 : 1);
    let allItems = getAllItems(block);
    const item = allItems[targetIndex];

    if ((item as Value).type === 'call_expression') {
      const value = (item.value as Value).value;
      const args = (item as Target).arguments;
      return args ? `${value} (${String(args[0].value)})` : String(value);
    }

    return String(item.value) || '';
  };

  const handleAutocompleteChange = (
    block: any,
    newValue: string,
    isLeft: boolean,
    isProperty = false,
    propertyIndex = 0,
  ) => {
    const updatedBlocks = inputBlocks.map((b) => {
      if (b === block) {
        const updatedBlock = { ...b };

        if (isProperty) {
          let properties = updatedBlock.value.filter((item) => item.type !== 'comment');
          properties[propertyIndex].value.value = newValue;
        } else {
          // handle left or right side property change here based on propertyIndex
          let current: any = updatedBlock.test.value;
          for (let i = 0; i < propertyIndex; i++) {
            current = current.right.value.right.value;
          }
          if (isLeft) {
            current.left.value = newValue;
            current.left.type = 'identifier';
          } else {
            current.right.value = newValue;
            current.right.type = 'identifier';
          }
        }
        return updatedBlock;
      }
      return b;
    });

    setInputBlocks(updatedBlocks);
    setFormData((prevFormData: any) => ({ ...prevFormData, inputBlocks: updatedBlocks }));
  };

  const getOperator = (block: InputBlock, isBoolean: boolean, count = 0): string => {
    let tempOperators = operators[block.id];
    tempOperators = isBoolean
      ? tempOperators.filter((op) => op === 'AND' || op === 'OR')
      : tempOperators.filter((op) => op !== 'AND' && op !== 'OR');
    return tempOperators[count];
  };

  return (
    <>
      {inputBlocks.map((block, blockInd) => {
        const count = numBooleanExpressions[block.id] || 0;
        let itemIndexes = [];
        for (let i = 0; i < count; i++) {
          itemIndexes.push(i);
        }
        return (
          <Box key={block.id}>
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
                      {results[block.id] &&
                        results[block.id].map((result, idx) => {
                          return (
                            <Typography key={idx} m={4}>
                              {Object.keys(result).map((key) => {
                                let combinedLeftOptions: string[] = variables.includes(String(key))
                                  ? [String(key), ...variables.filter((v) => v !== String(key))]
                                  : [String(key), ...variables];
                                let combinedRightOptions: string[] = variables.includes(
                                  String(result[key]),
                                )
                                  ? [
                                      String(result[key]),
                                      ...variables.filter((v) => v !== String(result[key])),
                                    ]
                                  : [String(result[key]), ...variables];
                                return (
                                  <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Autocomplete
                                      defaultValue={String(key)}
                                      size="small"
                                      options={combinedLeftOptions}
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
                                    <Typography sx={{ margin: 3, fontWeight: 'bold' }}>
                                      =
                                    </Typography>{' '}
                                    <Autocomplete
                                      defaultValue={String(result[key])}
                                      size="small"
                                      sx={{ width: 200, m: 2 }}
                                      options={combinedRightOptions}
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
                                          {option === String(result[key]) ? (
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
                                  </div>
                                );
                              })}
                            </Typography>
                          );
                        })}
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
