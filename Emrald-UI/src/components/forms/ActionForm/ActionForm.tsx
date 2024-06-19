import React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../MainDetailsForm';
import { Action } from '../../../types/Action';
import { useActionFormContext } from './ActionFormContext';
import { ActionType, MainItemTypes } from '../../../types/ItemTypes';
import { Transition, ChangeVarValue, ExtSimulation, RunApplication } from './FormFieldsByType';
import { State } from '../../../types/State';

interface ActionFormProps {
  actionData?: Action;
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

const ActionForm: React.FC<ActionFormProps> = ({ actionData, state }) => {
  const {
    name,
    desc,
    actType,
    actionTypeOptions,
    hasError,
    handleNameChange,
    setDesc,
    setActType,
    handleSave,
    initializeForm,
    reset,
  } = useActionFormContext();

  useEffect(() => {
    initializeForm(actionData);
  }, []);

  // Map action types to their respective sub-components and props
  const actionTypeToComponent: {
    [key in ActionType]: { component: React.FC<any>; props: any };
  } = {
    atTransition: { component: Transition, props: {} },
    atCngVarVal: { component: ChangeVarValue, props: {} },
    at3DSimMsg: { component: ExtSimulation, props: {} },
    atRunExtApp: { component: RunApplication, props: {} },
  };

  return (
    <Box sx={{ px: 3 }}>
      <Typography variant="h5" my={3}>
        {actionData ? `Edit` : `Create`} Action
      </Typography>
      <form>
        <MainDetailsForm
          itemType={MainItemTypes.Action}
          type={actType}
          setType={setActType}
          typeOptions={actionTypeOptions}
          name={name}
          handleNameChange={handleNameChange}
          desc={desc}
          setDesc={setDesc}
          error={hasError}
          errorMessage="An action with this name already exists."
          reset={reset}
          handleSave={() => handleSave(state)}
          reqPropsFilled={name && actType ? true : false}
        >
          {/* Render the appropriate sub-component based on selected action type */}
          {actType &&
            React.createElement(
              actionTypeToComponent[actType].component,
              actionTypeToComponent[actType].props,
            )}
        </MainDetailsForm>
      </form>
    </Box>
  );
};

export default ActionForm;
