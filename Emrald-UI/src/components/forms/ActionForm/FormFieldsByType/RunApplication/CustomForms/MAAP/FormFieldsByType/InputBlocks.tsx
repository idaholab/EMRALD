import { Autocomplete, Box, Divider, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import useRunApplication from '../../../useRunApplication';
import { InputBlock, Value } from '../../../CustomApplicationTypes';
import { appData } from '../../../../../../../../hooks/useAppData';

const InputBlocks = () => {
  const [inputBlocks, setInputBlocks] = useState<InputBlock[]>([]);
  const [numBooleanExpressions, setNumBooleanExpressions] = useState<{ [key: string]: number }>({});
  const [leftExpressionNames, setLeftExpressionNames] = useState<string[][]>([]);
  const [rightExpressionNames, setRightExpressionNames] = useState<string[][]>([]);
  const [operators, setOperators] = useState<{ [key: string]: string[] }>({});
  const { formData, setFormData } = useCustomForm();
  const { results, getResults, getAllItems, returnInputBlockItemNameInTest } = useRunApplication();
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
      getResults(block);
    });
    setInputBlocks(formData?.inputBlocks || []);
  }, []);

  const getNumBooleanCount = (block: InputBlock): number => {
    const allItems = getAllItems(block);
    return allItems.length / 2;
  };

  const getLeftOrRightName = (block: InputBlock, isLeft: boolean, count = 0): string => {
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
          if (isLeft) {
            if (property.target.type === 'identifier') {
              property.target.value = newValue;
              property.target.useVariable = useVariable;
            } else {
              (property.target.value as Value).value = newValue;
              (property.target.value as Value).useVariable = useVariable;
            }
            if (property.target.arguments) property.target.arguments = undefined;
          } else {
            if ((property.value as Value).type !== 'expression') {
              (property.value as Value).value = newValue;
              (property.value as Value).useVariable = useVariable;
            } else {
              const value: Value = {
                type: 'variable',
                value: newValue,
                useVariable: useVariable,
              };
              property.value = value;
            }
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
            <Typography m={2}>{formData.docComments[block.id]?.value}</Typography>
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
                      <Box sx={{ backgroundColor: '#f5f5f5', m: 3 }}>
                        {results[block.id] &&
                          Array.from(results[block.id].entries()).map(([key, value], idx) => (
                            <Box key={idx} m={4}>
                              <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
                                <Autocomplete
                                  defaultValue={String(key)}
                                  size="small"
                                  options={
                                    variables.includes(String(key))
                                      ? [String(key), ...variables.filter((v) => v !== String(key))]
                                      : [String(key), ...variables]
                                  }
                                  renderInput={(params) => <TextField {...params} value={params} />}
                                  sx={{ width: 200, m: 2 }}
                                  onChange={(_, newValue) =>
                                    handleAutocompleteChange(block, newValue || '', true, true, idx)
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
                                  renderInput={(params) => <TextField {...params} value={params} />}
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
                                    sx={{ flex: '1 1 40%', display: 'flex', alignItems: 'center' }}
                                  >
                                    <Typography m={2}>{block.value[idx].comment}</Typography>
                                  </Box>
                                )}
                              </div>
                            </Box>
                          ))}
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
