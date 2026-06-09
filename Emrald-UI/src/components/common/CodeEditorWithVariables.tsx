import type { ReactNode } from 'react';
import type { Variable } from '@/types/EMRALD_Model';
import { Box, Typography } from '@mui/material';
import { type CodeContext, CodeVariables } from './CodeVariables';
import { DroppableEditor } from './DroppableEditor';

interface CodeEditorWithVariablesProps {
  scriptCode?: string;
  setScriptCode: (value: string) => void;
  variableList: Variable[];
  codeVariables: string[];
  addToUsedVariables: (variableName: string) => void;
  heading?: ReactNode | string;
  codeContext?: CodeContext;
}

export const CodeEditorWithVariables: React.FC<
  CodeEditorWithVariablesProps
> = ({
  scriptCode,
  setScriptCode,
  variableList,
  codeVariables,
  addToUsedVariables,
  heading,
  codeContext,
}) => (
  <Box
    sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flex: 1 }}
  >
    <Box sx={{ flex: 1, mr: 3, minWidth: '340px' }}>
      <Typography sx={{ mb: 1 }} fontWeight={600}>
        {heading ?? 'Code (c#)'}
      </Typography>
      <DroppableEditor
        height="300px"
        defaultLanguage="csharp"
        language="csharp"
        value={scriptCode}
        onChange={value => {
          setScriptCode(value ?? '');
        }}
        options={{
          minimap: { enabled: false },
          snippetSuggestions: 'inline',
        }}
        addToUsedVariables={addToUsedVariables}
        codeVariables={codeVariables}
      />
    </Box>

    <CodeVariables
      variableList={variableList}
      codeVariables={codeVariables}
      addToUsedVariables={addToUsedVariables}
      codeContext={codeContext}
    />
  </Box>
);
