import { Editor, type EditorProps } from '@monaco-editor/react';
import { useEditorVariableDrop } from './useEditorVariableDrop';

interface DroppableEditorProps extends EditorProps {
  addToUsedVariables: (variableName: string) => void;
  codeVariables: string[];
}

export const DroppableEditor: React.FC<DroppableEditorProps> = ({
  addToUsedVariables,
  codeVariables,
  onMount,
  ...editorProps
}) => {
  const { handleMount, wrapperRef } = useEditorVariableDrop({
    addToUsedVariables,
    codeVariables,
  });

  return (
    <div ref={wrapperRef}>
      <Editor
        {...editorProps}
        onMount={(editor, monaco) => {
          handleMount(editor, monaco);
          onMount?.(editor, monaco);
        }}
      />
    </div>
  );
};
