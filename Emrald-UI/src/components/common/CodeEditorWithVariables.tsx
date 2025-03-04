import React from 'react';
import { Editor } from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import CodeVariables from './CodeVariables';
import { Variable } from '../../types/Variable';

interface CodeEditorWithVariablesProps {
  scriptCode?: string;
  setScriptCode: (value: string) => void;
  variableList: Variable[];
  codeVariables: string[];
  addToUsedVariables: (variableName: string) => void;
  heading?: React.ReactNode | string;
}

const CodeEditorWithVariables: React.FC<CodeEditorWithVariablesProps> = ({
  scriptCode,
  setScriptCode,
  variableList,
  codeVariables,
  addToUsedVariables,
  heading
}) => {
  return (
    <Box
      sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', flex: 1 }}
    >
      <Box sx={{ flex: 1, mr: 3, minWidth: '340px' }}>
        <Typography sx={{ mb: 1 }} fontWeight={600}>
          {heading ? heading : 'Code (c#)'}
        </Typography>
        <Editor
          height="300px"
          defaultLanguage="csharp"
          language="csharp"
          value={scriptCode}
          onChange={(value) => setScriptCode(value || '')}
          options={{
            minimap: { enabled: false },
            snippetSuggestions: 'inline',
          }}
        />
      </Box>

      <CodeVariables
        variableList={variableList}
        codeVariables={codeVariables}
        addToUsedVariables={addToUsedVariables}
      />
    </Box>
  );
};

export default CodeEditorWithVariables;
