import { Autocomplete, Box, Checkbox, Divider, TextField, Typography } from '@mui/material';
import { useVariableContext } from '../../../../../../../../contexts/VariableContext';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import { InputBlock, Target, Value } from '../maap';

const InputBlocks = () => {
  const { variableList } = useVariableContext();
  const [inputBlocks, setInputBlocks] = useState<InputBlock[]>([]);
  const { formData, setFormData } = useCustomForm();
  const variables = variableList.value.map(({ name }) => name);

  useEffect(() => {
    setInputBlocks(formData?.inputBlocks || []);
  }, [formData, setFormData]);

  const getLeftOrRightName = (block: InputBlock, isLeft: boolean): string => {
    const side = isLeft ? block.test.value.left : block.test.value.right;

    if (side.type === 'call_expression') {
      const value = (side.value as Value).value;
      const args = (side as Target).arguments;
      return args ? `${value} (${String(args[0].value)})` : String(value);
    }

    return String(side.value) || '';
  };

  const handleAutocompleteChange = (block: any, newValue: string, isLeft: boolean) => {
    const updatedBlocks = inputBlocks.map((b) => {
      if (b === block) {
        const updatedBlock = { ...b };
        if (isLeft) {
          updatedBlock.test.value.left.value = newValue;
          updatedBlock.test.value.left.type = 'identifier';
        } else {
          updatedBlock.test.value.right.value = newValue;
          updatedBlock.test.value.right.type = 'identifier';
        }
        return updatedBlock;
      }
      return b;
    });
    setInputBlocks(updatedBlocks);
    setFormData((prevFormData: any) => ({ ...prevFormData, inputBlocks: updatedBlocks }));
  };
  return (
    <>
      {inputBlocks.map((block: any) => (
        <>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography fontWeight={600} fontSize={18} mr={2}>
                When
              </Typography>
              <Autocomplete
                size="small"
                disablePortal
                options={variables}
                defaultValue={getLeftOrRightName(block, true)}
                onChange={(_, newValue) => {
                  if (newValue) handleAutocompleteChange(block, newValue, true);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} />}
              />
              <Typography fontWeight={600} fontSize={18} sx={{ px: 3 }}>
                {' '}
                {'>='}{' '}
              </Typography>
              <Autocomplete
                size="small"
                disablePortal
                options={variables}
                defaultValue={getLeftOrRightName(block, false)}
                onChange={(_, newValue) => {
                  if (newValue) handleAutocompleteChange(block, newValue, false);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        </>
      ))}
    </>
  );
};

export default InputBlocks;
