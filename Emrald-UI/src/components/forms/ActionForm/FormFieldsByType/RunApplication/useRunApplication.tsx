import { useState } from 'react';
import { useActionFormContext } from '../../ActionFormContext';

const useRunApplication = () => {
  const { setMakeInputFileCode } = useActionFormContext();
  const [preCodeUsed, setPreCodeUsed] = useState(false);
  const [results, setResults] = useState<{ [key: string]: Map<string, string> }>({});

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

export default useRunApplication;
