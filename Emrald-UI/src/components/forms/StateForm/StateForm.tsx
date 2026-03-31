import type {
  DiagramType,
  State,
  StateEvalValue,
  StateType,
} from '../../../types/EMRALD_Model';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSignal } from '@preact/signals-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { emptyState, useStateContext } from '../../../contexts/StateContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { currentDiagram } from '../../diagrams/EmraldDiagram/EmraldDiagram';
import { MainDetailsForm } from '../../forms/MainDetailsForm';

interface StateFormProps {
  stateData?: State;
}

export const StateForm: React.FC<StateFormProps> = ({
  stateData,
}: StateFormProps) => {
  const { handleClose } = useWindowContext();
  const { statesList, updateState, createState } = useStateContext();
  const { updateDiagram } = useDiagramContext();
  const state = useSignal(stateData ?? emptyState);
  const [name, setName] = useState(stateData?.name ?? '');
  const [desc, setDesc] = useState(stateData?.desc ?? '');
  const [stateType, setStateType] = useState<StateType>(
    stateData?.stateType ?? 'stStandard',
  );
  const [diagramType, setDiagramType] = useState<DiagramType>('dtSingle');
  const [defaultSingleStateValue, setDefaultSingleStateValue]
    = useState<StateEvalValue>(stateData?.defaultSingleStateValue ?? 'Ignore');
  const [hasError, setHasError] = useState(false);
  const [originalName] = useState(stateData?.name ?? '');

  const stateTypeOptions = [
    { value: 'stStart', label: 'Start' },
    { value: 'stStandard', label: 'Standard' },
    { value: 'stKeyState', label: 'Key State' },
    { value: 'stTerminal', label: 'Terminal' },
  ];

  const handleNameChange = (newName: string) => {
    const trimmedName = newName.trim();
    setHasError(
      statesList.value
        .filter(state => state.name !== originalName)
        .some(node => node.name === trimmedName)
        || /[^a-zA-Z0-9-_ ]/.test(trimmedName),
    );
    setName(newName);
  };

  const handleSave = () => {
    if (stateData) {
      updateState({
        ...state.value,
        stateType,
        name: name.trim(),
        desc,
        defaultSingleStateValue,
      });
      if (name !== originalName) {
        currentDiagram.value.states = [
          ...currentDiagram.value.states.filter(
            state => state !== originalName,
          ),
          name,
        ];
        updateDiagram({
          ...currentDiagram.value,
        });
      }
    } else {
      createState({
        ...state.value,
        id: uuidv4(),
        name: name.trim(),
        desc,
        stateType,
        defaultSingleStateValue,
        diagramName: currentDiagram.value.name || '',
      });
      const { states } = currentDiagram.value;
      currentDiagram.value.states = [...states, name.trim()];
      updateDiagram({
        ...currentDiagram.value,
      });
    }
    handleClose();
  };

  useEffect(() => {
    setDiagramType(currentDiagram.value.diagramType);
  }, []);
  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {stateData ? `Edit` : `Create`} State
      </Typography>
      <form>
        <MainDetailsForm
          itemType="State"
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
          reqPropsFilled={name ? true : false}
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
              <FormLabel component="legend">
                Default Logic Tree Evaluation Value
              </FormLabel>
              <RadioGroup
                sx={{ margin: '8px' }}
                aria-label="status-value"
                name="status-value"
                value={defaultSingleStateValue}
                onChange={event => {
                  setDefaultSingleStateValue(
                    event.target.value as StateEvalValue,
                  );
                }}
                row
              >
                <FormControlLabel
                  value="Ignore"
                  control={<Radio />}
                  label="Unknown"
                />
                <FormControlLabel
                  value="True"
                  control={<Radio />}
                  label="True"
                />
                <FormControlLabel
                  value="False"
                  control={<Radio />}
                  label="False"
                />
              </RadioGroup>
            </FormControl>
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};
