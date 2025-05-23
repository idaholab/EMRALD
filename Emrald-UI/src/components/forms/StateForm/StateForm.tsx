import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { State, DiagramType, StateEvalValue, StateType } from '../../../types/EMRALD_Model';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../../forms/MainDetailsForm';
import { emptyState, useStateContext } from '../../../contexts/StateContext';
import { useSignal } from '@preact/signals-react';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { currentDiagram } from '../../diagrams/EmraldDiagram/EmraldDiagram';

interface StateFormProps {
  stateData?: State;
}

const StateForm: React.FC<StateFormProps> = ({ stateData }: StateFormProps) => {
  const { handleClose } = useWindowContext();
  const { statesList, updateState, createState } = useStateContext();
  const { getDiagramByDiagramName, updateDiagram } = useDiagramContext();
  const state = useSignal<State>(stateData || emptyState);
  const [name, setName] = useState<string>(stateData?.name || '');
  const [desc, setDesc] = useState<string>(stateData?.desc || '');
  const [stateType, setStateType] = useState<StateType>(stateData?.stateType || 'stStandard');
  const [diagramType, setDiagramType] = useState<DiagramType>('dtSingle');
  const [defaultSingleStateValue, setDefaultSingleStateValue] = useState<StateEvalValue>(
    stateData?.defaultSingleStateValue || 'Ignore',
  );
  const [hasError, setHasError] = useState<boolean>(false);
  const [originalName] = useState<string>(stateData?.name || '');

  const stateTypeOptions = [
    { value: 'stStart', label: 'Start' },
    { value: 'stStandard', label: 'Standard' },
    { value: 'stKeyState', label: 'Key State' },
    { value: 'stTerminal', label: 'Terminal' },
  ];

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    const duplicateName = statesList.value
      .filter((state) => state.name !== originalName)
      .some((node) => node.name === trimmedName);
    const hasInvalidChars = /[^a-zA-Z0-9-_ ]/.test(trimmedName);
    setHasError(duplicateName || hasInvalidChars);
    setName(newName);
  };

  const handleSave = async () => {
    if (stateData) {
      await updateState({
        ...state.value,
        stateType,
        name: name.trim(),
        desc,
        defaultSingleStateValue,
      });
      if (name !== originalName) {
        const newList = currentDiagram.value.states.filter((state) => state !== originalName);
        currentDiagram.value.states = [...newList, name];
        updateDiagram({
          ...currentDiagram.value,
        });
      }
    } else {
      await createState({
        ...state.value,
        id: uuidv4(),
        name: name.trim(),
        desc,
        stateType,
        defaultSingleStateValue,
        diagramName: currentDiagram.value?.name || '',
      });
      if (currentDiagram.value) {
        const { states } = currentDiagram.value;
        currentDiagram.value.states = [...states, name.trim()];
        updateDiagram({
          ...currentDiagram.value
        });
      }
    }
    handleClose();
  };

  useEffect(() => {
    if (currentDiagram.value?.diagramType) setDiagramType(currentDiagram.value.diagramType);
    else if (stateData) {
      const diagramType = getDiagramByDiagramName(stateData.diagramName).diagramType;
      setDiagramType(diagramType);
    }
  }, []);
  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {stateData ? `Edit` : `Create`} State
      </Typography>
      <form>
        <MainDetailsForm
          itemType={'State'}
          type={stateType}
          setType={setStateType}
          typeOptions={stateTypeOptions}
          name={name}
          handleNameChange={handleNameChange}
          desc={desc}
          setDesc={setDesc}
          nameError={hasError}
          error={hasError}
          errorMessage="A State with this name already exists, or the name contains an invalid character."
          handleSave={handleSave}
          reqPropsFilled={name && stateType ? true : false}
        >
          {diagramType === 'dtSingle' && (
            <FormControl
              component="fieldset"
              sx={{
                minWidth: 120,
                width: '100%',
                border: 1,
                p: 1,
                borderRadius: 1,
              }}
            >
              <FormLabel component="legend">Default Logic Tree Evaluation Value</FormLabel>
              <RadioGroup
                sx={{ margin: '8px' }}
                aria-label="status-value"
                name="status-value"
                value={defaultSingleStateValue}
                onChange={(event) =>
                  setDefaultSingleStateValue(event.target.value as StateEvalValue)
                }
                row
              >
                <FormControlLabel value="Ignore" control={<Radio />} label="Unknown" />
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </RadioGroup>
            </FormControl>
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};

export default StateForm;
