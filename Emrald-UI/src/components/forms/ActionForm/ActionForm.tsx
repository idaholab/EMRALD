import React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../MainDetailsForm';
import type { Action, State, Event, ActionType } from '../../../types/EMRALD_Model';
import { useActionFormContext } from './ActionFormContext';
import { Transition, ChangeVarValue, ExtSimulation, RunApplication } from './FormFieldsByType';
import { useWindowContext } from '../../../contexts/WindowContext';
interface ActionFormProps {
  actionData?: Action;
  event?: Event;
  state?: State;
}

export interface NewStateItem {
  id: string;
  toState: string;
  prob: number;
  varProb?: string | null | undefined;
  failDesc?: string;
  remaining: boolean;
  probType: string;
}

const ActionForm: React.FC<ActionFormProps> = ({ actionData, event, state }) => {
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
    savePosition,
  } = useActionFormContext();
  const { resizeListener, activeWindowId } = useWindowContext();

  useEffect(() => {
    initializeForm(actionData);
  }, []);

  // Map action types to their respective sub-components and props
  const actionTypeToComponent: Record<ActionType, { component: React.FC<any>; props: any }> = {
    atTransition: { component: Transition, props: {} },
    atCngVarVal: { component: ChangeVarValue, props: {} },
    at3DSimMsg: { component: ExtSimulation, props: {} },
    atRunExtApp: { component: RunApplication, props: {} },
  };

  resizeListener.on('resize', (window, position) => {
    if (window === activeWindowId) {
      savePosition(position);
    }
  });

  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {actionData ? `Edit` : `Create`} Action
      </Typography>
      <form>
        <MainDetailsForm
          itemType={'Action'}
          type={actType}
          setType={setActType}
          typeOptions={actionTypeOptions}
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
          {React.createElement(
            actionTypeToComponent[actType].component,
            actionTypeToComponent[actType].props,
          )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};

export default ActionForm;
