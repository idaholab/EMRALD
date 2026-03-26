import type { MAAPConditionalBlockStatement } from '../../../../../../../../types/EMRALD_Model';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCustomForm } from '../../useCustomForm';
import { ConditionalBlock } from './SyntaxComponents/ConditionalBlock';

export const InputBlocks: React.FC = () => {
  const [inputBlocks, setInputBlocks] = useState<
    MAAPConditionalBlockStatement[]
  >([]);
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
      {inputBlocks.map(block => (
        <Box>
          <ConditionalBlock
            blockType={block.blockType}
            test={block.test}
            value={block.value}
          />
        </Box>
      ))}
    </>
  );
};
