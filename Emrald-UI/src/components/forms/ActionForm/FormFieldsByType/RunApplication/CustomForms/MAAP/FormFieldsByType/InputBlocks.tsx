import { Autocomplete, Box, Divider, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import { InputBlock, InputResultValue, Target, Test, Value } from '../maap';
import { appData } from '../../../../../../../../hooks/useAppData';

const InputBlocks = () => {
  const [inputBlocks, setInputBlocks] = useState<InputBlock[]>([]);
  const [numBooleanExpressions, setNumBooleanExpressions] = useState<{ [key: string]: number }>({});
  const [results, setResults] = useState<{ [key: string]: { [key: string]: string }[] }>({});
  const { formData, setFormData } = useCustomForm();
  const variables = appData.value.VariableList.map(({ name }) => name);

  useEffect(() => {
    formData.inputBlocks?.forEach((block: InputBlock) => {
      if (!numBooleanExpressions[block.id]) {
        const count = getNumBooleanCount(block);
        setNumBooleanExpressions((prev) => ({ ...prev, [block.id]: count }));
      }

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
  }, [formData, setFormData]);

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

  const handleAutocompleteChange = (block: any, newValue: string, isLeft: boolean) => {
    const updatedBlocks = inputBlocks.map((b) => {
      if (b === block) {
        const updatedBlock = { ...b };
        if (isLeft) {
          updatedBlock.test.value.left.value = newValue;
          (updatedBlock.test.value.left as Value).type = 'identifier';
        } else {
          updatedBlock.test.value.right.value = newValue;
          (updatedBlock.test.value.right as Value).type = 'identifier';
        }
        return updatedBlock;
      }
      return b;
    });
    setInputBlocks(updatedBlocks);
    setFormData((prevFormData: any) => ({ ...prevFormData, inputBlocks: updatedBlocks }));
  };

  const getOperator = (block: InputBlock, count = 0): string => {
    let operators = getAllItems(block, 'operators');
    operators = operators.filter((op) => op !== 'AND' && op !== 'OR');
    return operators[count];
  };
  const getBooleanOperator = (block: InputBlock, count = 0): string => {
    let operators = getAllItems(block, 'operators');
    operators = operators.filter((op) => op === 'AND' || op === 'OR');
    return operators[count];
  };

  return (
    <>
      {inputBlocks.map((block) => {
        const count = numBooleanExpressions[block.id] || 0;
        return (
          <Box key={block.id}>
            {Array.from({ length: count }).map((_, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography fontWeight={600} fontSize={18} mr={2}>
                    When
                  </Typography>
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={variables}
                    defaultValue={getLeftOrRightName(block, true, index)}
                    onChange={(_, newValue) => {
                      if (newValue) handleAutocompleteChange(block, newValue, true);
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Typography fontWeight={600} fontSize={18} sx={{ px: 3 }}>
                    {getOperator(block, index)}
                  </Typography>
                  <Autocomplete
                    size="small"
                    disablePortal
                    options={variables}
                    defaultValue={getLeftOrRightName(block, false, index)}
                    onChange={(_, newValue) => {
                      if (newValue) handleAutocompleteChange(block, newValue, false);
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                {count > 1 && index !== count - 1 ? (
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {getBooleanOperator(block, index)}
                  </Typography>
                ) : (
                  <>
                    {results[block.id] &&
                      results[block.id].map((result, idx) => (
                        <Typography key={idx} m={4}>
                          {Object.keys(result).map((key) => (
                            <div key={key} style={{ display: 'flex', flexDirection: 'row' }}>
                              <Autocomplete
                                defaultValue={key}
                                size="small"
                                options={variables}
                                renderInput={(params) => <TextField {...params} />}
                                sx={{ width: 200, m: 2 }}
                              />{' '}
                              <Typography sx={{ margin: 2 }}>=</Typography>{' '}
                              <TextField value={result[key]} size="small" sx={{ margin: 2 }} />
                            </div>
                          ))}
                        </Typography>
                      ))}
                    <Divider sx={{ my: 2 }} />
                  </>
                )}
              </Box>
            ))}
          </Box>
        );
      })}
    </>
  );
};

export default InputBlocks;
