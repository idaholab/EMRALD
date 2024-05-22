import { FormControlLabel, MenuItem, Radio, RadioGroup } from '@mui/material';
import { useEventFormContext } from '../EventFormContext';
import { SelectComponent } from '../../../common';
import { appData } from '../../../../hooks/useAppData';

const ComponentLogic = () => {
  const { onSuccess, setOnSuccess, triggerOnFalse, setTriggerOnFalse, logicTop, setLogicTop } =
    useEventFormContext();
  return (
    <div>
      <RadioGroup
        value={onSuccess}
        onChange={(e) => setOnSuccess(e.target.value === 'true' ? true : false)}
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
        value={triggerOnFalse}
        onChange={(e) => setTriggerOnFalse(e.target.value === 'true' ? true : false)}
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
      <SelectComponent value={logicTop} label={'LogicTop'} setValue={setLogicTop}>
        {appData.value.LogicNodeList.filter((node) => node.isRoot).map((node, index) => (
          <MenuItem key={index} value={node.name}>
            {node.name}
          </MenuItem>
        ))}
      </SelectComponent>
    </div>
  );
};

export default ComponentLogic;
