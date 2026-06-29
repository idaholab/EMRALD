import type { EventFormProps } from '../EventForm';
import type {
  DistributionType,
  EventDistributionParameter,
  TimeVariableUnit,
  VarChangeOptions,
} from '@/types/EMRALD_Model';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { DistributionFields } from '@/components/common';
import { useEventFormContext } from '../EventFormContext';
import { VariableChangesPiece } from './VariableChangesPiece';

export const Distribution: React.FC<EventFormProps> = ({ eventData }) => {
  const { invalidValues, setInvalidValues, setTypeProperties, sync }
    = useEventFormContext();

  const [dfltTimeRate, setDfltTimeRate] = useState<TimeVariableUnit>();
  const [parameters, setParameters] = useState<EventDistributionParameter[]>();
  const [distType, setDistType] = useState<DistributionType>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions>();
  const [persistent, setPersistent] = useState<boolean>(false);
  const [variableChecked, setVariableChecked] = useState<boolean>(false);

  useEffect(() => {
    setDfltTimeRate(eventData?.dfltTimeRate ?? 'trHours');
    setParameters(eventData?.parameters);
    setDistType(eventData?.distType ?? 'dtNormal');
    setPersistent(eventData?.persistent ?? false);
    setOnVarChange(eventData?.onVarChange);
    setTypeProperties([
      'dfltTimeRate',
      'parameters',
      'distType',
      'persistent',
      'onVarChange',
    ]);
  }, []);

  useEffect(() => {
    sync({ distType, persistent, onVarChange, parameters, dfltTimeRate });
  }, [distType, persistent, onVarChange, parameters, dfltTimeRate]);

  const handleVariableChecked = (anyChecked: boolean) => {
    setVariableChecked(anyChecked);
    if (
      anyChecked
      && (typeof onVarChange !== 'string' || onVarChange.length === 0)
    ) {
      setOnVarChange('ocIgnore');
    }
  };

  return (
    <>
      <FormControlLabel
        label="Persistent - Keeps initial time between state movement and only re-samples after it occurs."
        control={
          <Checkbox
            checked={persistent}
            value={persistent}
            onChange={e => {
              setPersistent(e.target.checked);
            }}
          />
        }
      />
      <DistributionFields
        distType={distType}
        setDistType={setDistType}
        parameters={parameters}
        setParameters={setParameters}
        dfltTimeRate={dfltTimeRate}
        setDfltTimeRate={setDfltTimeRate}
        invalidValues={invalidValues}
        setInvalidValues={setInvalidValues}
        onVariableChecked={handleVariableChecked}
      />
      {variableChecked && (
        <VariableChangesPiece
          onVarChange={onVarChange}
          setOnVarChange={setOnVarChange}
        />
      )}
    </>
  );
};
