import type { Monaco, OnMount } from '@monaco-editor/react';
import type { editor as monacoEditor } from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { VARIABLE_DRAG_MIME } from './variableDrag';

interface UseEditorVariableDropOptions {
  addToUsedVariables: (variableName: string) => void;
  codeVariables: string[];
}

export function useEditorVariableDrop({
  addToUsedVariables,
  codeVariables,
}: UseEditorVariableDropOptions) {
  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const codeVariablesRef = useRef(codeVariables);
  const addToUsedVariablesRef = useRef(addToUsedVariables);

  useEffect(() => {
    codeVariablesRef.current = codeVariables;
  }, [codeVariables]);

  useEffect(() => {
    addToUsedVariablesRef.current = addToUsedVariables;
  }, [addToUsedVariables]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const hasVariablePayload = (event: DragEvent) =>
      !!event.dataTransfer?.types.includes(VARIABLE_DRAG_MIME);

    const handleDragOver = (event: DragEvent) => {
      if (!hasVariablePayload(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = (event: DragEvent) => {
      if (!hasVariablePayload(event)) {
        return;
      }
      const name = event.dataTransfer?.getData(VARIABLE_DRAG_MIME) ?? '';
      if (!name) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (!editor || !monaco) {
        return;
      }

      const target = editor.getTargetAtClientPoint(
        event.clientX,
        event.clientY,
      );
      const position = target?.position ?? editor.getPosition();
      if (!position) {
        return;
      }

      editor.executeEdits('emrald-variable-drop', [
        {
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column,
          ),
          text: name,
          forceMoveMarkers: true,
        },
      ]);
      editor.setPosition({
        lineNumber: position.lineNumber,
        column: position.column + name.length,
      });
      editor.focus();

      if (!codeVariablesRef.current.includes(name)) {
        addToUsedVariablesRef.current(name);
      }
    };

    wrapper.addEventListener('dragover', handleDragOver, true);
    wrapper.addEventListener('drop', handleDrop, true);
    return () => {
      wrapper.removeEventListener('dragover', handleDragOver, true);
      wrapper.removeEventListener('drop', handleDrop, true);
    };
  }, []);

  return { handleMount, wrapperRef };
}
