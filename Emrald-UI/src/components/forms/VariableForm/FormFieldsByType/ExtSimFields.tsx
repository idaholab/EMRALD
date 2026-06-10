import type { VariableFormProps } from '../VariableForm';
import { MenuItem, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectComponent } from '@/components/common';
import { useExtSimContext } from '@/contexts/ExtSimContext';
import { appData } from '@/hooks/useAppData';
import { useVariableFormContext } from '../VariableFormContext';
import { GlobalFields } from './GlobalFields';
import { validateWatchEventCriteria } from './watchEventCriteria';

export const ExtSimFields: React.FC<VariableFormProps> = ({ variableData }) => {
  const { sync, setTypeProperties, setExtSimError, type } = useVariableFormContext();
  const { extSims } = useExtSimContext();

  const [extSim, setExtSim] = useState<string>();
  const [sim3DId, setSim3DId] = useState<string>();

  // Watch Event Criteria - an optional fParser expression for when the external sim should report
  // this variable. The user types it directly; it is validated against accepted fParser syntax.
  const [criteria, setCriteria] = useState<string>('');
  const [criteriaError, setCriteriaError] = useState<string>();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setExtSim(variableData?.extSim);
    setSim3DId(variableData?.sim3DId);
    setCriteria(variableData?.WatchEventCriteria ?? '');
    // Surface an invalid expression that was already saved without waiting for a blur.
    setTouched(!!variableData?.WatchEventCriteria);
    setTypeProperties(['extSim', 'sim3DId', 'WatchEventCriteria']);
  }, []);

  // The expression may only reference sim3D ids of external sim (gt3DSim) variables.
  const allowedVariables = () => {
    const allowed = new Set<string>();
    for (const v of appData.value.VariableList) {
      if (v.varScope === 'gt3DSim' && v.sim3DId) {
        allowed.add(v.sim3DId);
      }
    }
    if (sim3DId) {
      allowed.add(sim3DId);
    }
    return allowed;
  };

  // Re-validate whenever the expression or the (allowed) ids change, and feed the result to the
  // form so Save is blocked while the expression is invalid.
  useEffect(() => {
    const result = validateWatchEventCriteria(criteria, allowedVariables());
    setCriteriaError(result.valid ? undefined : result.error);
    setExtSimError(!result.valid);
    sync({ extSim, sim3DId, WatchEventCriteria: criteria.trim() === '' ? undefined : criteria });
  }, [extSim, sim3DId, criteria]);

  // Clear the form-level error flag if this field set Ext Sim is no longer shown.
  useEffect(() => () => {
    setExtSimError(false);
  }, []);

  const showError = touched && !!criteriaError;

  return (
    <>
      <GlobalFields />
      <SelectComponent
        fullWidth
        label="External Sim"
        setValue={value => {
          setExtSim(value);
        }}
        value={extSim}
      >
        {extSims.map(e => (
          <MenuItem key={e.id} value={e.name}>
            {e.name}
          </MenuItem>
        ))}
      </SelectComponent>
      <TextField
        label="3DSimID"
        margin="normal"
        variant="outlined"
        size="small"
        value={sim3DId}
        onChange={e => {
          setSim3DId(e.target.value);
        }}
        fullWidth
        sx={{ mb: 0 }}
      />
      <Typography variant="caption">
        <i>(Name or ID of variable in the external simulation)</i>
      </Typography>

      {type !== 'string' && (
        <>
          <TextField
            label="Watch Event Criteria (optional)"
            margin="normal"
            variant="outlined"
            size="small"
            value={criteria}
            onChange={e => {
              setCriteria(e.target.value);
            }}
            onBlur={() => {
              setTouched(true);
            }}
            error={showError}
            helperText={showError ? criteriaError : ''}
            fullWidth
            multiline
            sx={{ mb: 0 }}
          />
          <Typography variant="caption">
            <i>
              Optional fParser expression. The external sim only reports this variable while the
              expression is true; leave blank to report on every change. Use this variable's 3D Sim
              ID and other external-sim variable ids with operators {'> < >= <= = != & (and) | (or)'},
              arithmetic + - * /, and parentheses for order of operations. Example:{' '}
              {`(${sim3DId || 'valve_12'} > 5) & (${sim3DId || 'valve_12'} < 10)`}
            </i>
          </Typography>
        </>
      )}
    </>
  );
};
