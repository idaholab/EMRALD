import { FormControlLabel, MenuItem, Radio, RadioGroup } from '@mui/material';
import { useEffect } from 'react';
import { SelectComponent } from '@/components/common';
import { appData } from '@/hooks/useAppData';
import { useEventFormContext } from '../EventFormContext';

export const ComponentLogic: React.FC = () => {
  const {
    onSuccess,
    setOnSuccess,
    triggerOnFalse,
    setTriggerOnFalse,
    logicTop,
    setLogicTop,
    setInvalidValues,
  } = useEventFormContext();

  useEffect(() => {
    if (onSuccess === undefined) {
      setOnSuccess(false);
    }
    if (triggerOnFalse === undefined) {
      setTriggerOnFalse(false);
    }
  }, []);
  return (
    <div>
      <RadioGroup
        value={onSuccess ?? false}
        onChange={e => {
          setOnSuccess(e.target.value === 'true' ? true : false);
        }}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="Success Tree"
          checked={onSuccess ? true : false}
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="Failure Tree"
          checked={onSuccess ? false : true}
        />
      </RadioGroup>
      <RadioGroup
        value={triggerOnFalse ?? false}
        onChange={e => {
          setTriggerOnFalse(e.target.value === 'true' ? true : false);
        }}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="Trigger on False"
          checked={triggerOnFalse ? true : false}
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="Trigger on True"
          checked={triggerOnFalse ? false : true}
        />
      </RadioGroup>
      <SelectComponent
        value={logicTop ?? ''}
        label="LogicTop"
        setValue={value => {
          setLogicTop(value);
          if (value.length > 0) {
            setInvalidValues(prevInvalidValues => {
              prevInvalidValues.delete('LogicTop');
              return prevInvalidValues;
            });
          }
        }}
      >
        {appData.value.LogicNodeList.filter(node => node.isRoot).map(
          (node, index) => (
            <MenuItem key={index} value={node.name}>
              {node.name}
            </MenuItem>
          ),
        )}
      </SelectComponent>
    </div>
  );
};
