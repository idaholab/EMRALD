import type {
  Action,
  ActionType,
  Event,
  State,
} from '../../../types/EMRALD_Model';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createElement, useEffect } from 'react';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { MainDetailsForm } from '../MainDetailsForm';
import { useActionFormContext } from './ActionFormContext';
import {
  ChangeVarValue,
  ExtSimulation,
  RunApplication,
  Transition,
} from './FormFieldsByType';
interface ActionFormProps {
  actionData?: Action;
  event?: Event;
  state?: State;
}

export interface NewStateItem {
  id: string;
  toState: string;
  prob: number;
  varProb?: string | null;
  failDesc?: string;
  remaining: boolean;
  probType: string;
}

export const ActionForm: React.FC<ActionFormProps> = ({
  actionData,
  event,
  state,
}) => {
  const {
    name,
    desc,
    actType,
    actionTypeOptions,
    reqPropsFilled,
    hasError,
    checkForDuplicateNames,
    handleNameChange,
    setDesc,
    setActType,
    handleSave,
    initializeForm,
    reset,
  } = useActionFormContext();
  const { getDiagramByDiagramName } = useDiagramContext();

  // Transition actions are not allowed as immediate actions in a single-state
  // diagram. This only applies when creating a brand-new action under the
  // Immediate Actions section (state, no event). Editing an existing action
  // (only actionData) is unaffected.
  const disallowTransition
    = !!state
      && !event
      && getDiagramByDiagramName(state.diagramName)?.diagramType === 'dtSingle';

  useEffect(() => {
    initializeForm(actionData);
    // The form defaults to the (now-disabled) Transition type, so move it off
    // of that for a new immediate action in a single-state diagram.
    if (disallowTransition && !actionData) {
      setActType('atCngVarVal');
    }
  }, []);

  const typeOptions = actionTypeOptions.map(option => ({
    ...option,
    disabled: disallowTransition && option.value === 'atTransition',
  }));

  // Map action types to their respective sub-components and props
  const actionTypeToComponent: Record<
    ActionType,
    { component: React.FC<any>; props: any }
  > = {
    atTransition: { component: Transition, props: {} },
    atCngVarVal: { component: ChangeVarValue, props: {} },
    at3DSimMsg: { component: ExtSimulation, props: {} },
    atRunExtApp: { component: RunApplication, props: {} },
  };

  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {actionData ? `Edit` : `Create`} Action
      </Typography>
      <form>
        <MainDetailsForm
          itemType="Action"
          type={actType}
          setType={setActType}
          typeOptions={typeOptions}
          name={name}
          handleNameChange={handleNameChange}
          desc={desc}
          setDesc={setDesc}
          nameError={checkForDuplicateNames()}
          error={hasError}
          errorMessage="An action with this name already exists, or includes an invalid character."
          reset={reset}
          handleSave={() => {
            handleSave(event, state);
          }}
          reqPropsFilled={reqPropsFilled}
        >
          {/* Render the appropriate sub-component based on selected action type */}
          {createElement(
            actionTypeToComponent[actType].component,
            actionTypeToComponent[actType].props,
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};
