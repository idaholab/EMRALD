import type {
  Diagram,
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
import { MainDetailsForm } from '../../forms/MainDetailsForm';

interface StateFormProps {
  stateData?: State;
  diagram?: Diagram;
}

export const StateForm: React.FC<StateFormProps> = ({
  stateData,
  diagram,
}: StateFormProps) => {
  const { handleClose } = useWindowContext();
  const { statesList, updateState, createState } = useStateContext();
  const { updateDiagram, getDiagramByDiagramName } = useDiagramContext();
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

  // The diagram a state belongs to is authoritative on the state itself
  // (a state can only be in one diagram). For new states there is no
  // diagramName yet, so use the diagram the form was opened from. We never
  // rely on the shared `currentDiagram` signal here, which points at whichever
  // diagram rendered last and is wrong when multiple diagrams are open.
  const owningDiagramName = stateData?.diagramName ?? diagram?.name ?? '';

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
    const trimmedName = name.trim();
    if (stateData) {
      // updateState renames the state and updates every reference to it,
      // including the owning diagram's `states` list (see
      // updateModelAndReferences in UpdateModel.ts). No manual diagram update
      // is needed here, and doing one against the global currentDiagram could
      // add the name to the wrong diagram when several are open.
      updateState({
        ...state.value,
        stateType,
        name: trimmedName,
        desc,
        defaultSingleStateValue,
      });
    } else {
      createState({
        ...state.value,
        id: uuidv4(),
        name: trimmedName,
        desc,
        stateType,
        defaultSingleStateValue,
        diagramName: owningDiagramName,
      });
      const owningDiagram = getDiagramByDiagramName(owningDiagramName);
      if (owningDiagram) {
        updateDiagram({
          ...owningDiagram,
          states: [...owningDiagram.states, trimmedName],
        });
      }
    }
    handleClose();
  };

  useEffect(() => {
    const owningDiagram = getDiagramByDiagramName(owningDiagramName);
    if (owningDiagram) {
      setDiagramType(owningDiagram.diagramType);
    }
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
