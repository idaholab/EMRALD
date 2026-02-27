import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import type { MAAPConditionalBlockStatement } from '../../../../../../../../types/EMRALD_Model';
import { ConditionalBlock } from './SyntaxComponents/ConditionalBlock';

const InputBlocks = () => {
  const [inputBlocks, setInputBlocks] = useState<MAAPConditionalBlockStatement[]>([]);
  const { formData, setFormData } = useCustomForm();

  useEffect(() => {
    setInputBlocks(formData?.inputBlocks ?? []);
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      caType: 'MAAP',
    });
  }, [inputBlocks]);

  return (
    <>
      {inputBlocks.map((block) => {
        return (
          <Box>
            <ConditionalBlock
              blockType={block.blockType}
              test={block.test}
              value={block.value}
            />
          </Box>
        );
      })}
    </>
  );
};

export default InputBlocks;
