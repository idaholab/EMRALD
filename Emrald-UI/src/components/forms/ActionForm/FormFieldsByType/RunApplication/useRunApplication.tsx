import { useState } from 'react';
import { useActionFormContext } from '../../ActionFormContext';

export function useRunApplication() {
  const { setMakeInputFileCode } = useActionFormContext();
  const [preCodeUsed, setPreCodeUsed] = useState(false);
  const [results, setResults] = useState<Record<string, Map<string, string>>>({});

  const ReturnPreCode = (code: string) => {
    setMakeInputFileCode(code);
    setPreCodeUsed(true);
  };

  return {
    preCodeUsed,
    results,
    ReturnPreCode,
    setResults,
  };
};
