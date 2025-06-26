import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import type { MAAPConditionalBlockStatement } from '../../../../../../../../types/EMRALD_Model';
import { ConditionalBlock } from './SyntaxComponents/ConditionalBlock';

const InputBlocks = () => {
  const [inputBlocks, setInputBlocks] = useState<MAAPConditionalBlockStatement[]>([]);
  const { formData } = useCustomForm();

  useEffect(() => {
    setInputBlocks(formData?.inputBlocks ?? []);
  }, []);

  return (
    <>
      {inputBlocks.map((block) => {
        return (
          <Box key={block.id}>
            <ConditionalBlock blockType={block.blockType} test={block.test} />
          </Box>
        );
      })}
    </>
  );
};

export default InputBlocks;
