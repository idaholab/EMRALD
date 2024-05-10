import React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../MainDetailsForm';
import { Action } from '../../../types/Action';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useActionFormContext } from './ActionFormContext';
import { ActionType, MainItemTypes } from '../../../types/ItemTypes';
import {
  Transition,
  ChangeVarValue,
  ExtSimulation,
  RunApplication,
} from './FormFieldsByType';

interface ActionFormProps {
  actionData?: Action;
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

const ActionForm: React.FC<ActionFormProps> = ({ actionData }) => {
  const {
    name,
    desc,
    actType,
    actionTypeOptions,
    hasError,
    setName,
    setDesc,
    setActType,
    handleSave,
    initializeForm,
  } = useActionFormContext();

  useEffect(() => {
    initializeForm(actionData);
  }, []);

  const { handleClose } = useWindowContext();

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
          typeDisabled={actionData?.actType !== undefined}
          typeOptions={actionTypeOptions}
          name={name}
          setName={setName}
          desc={desc}
          setDesc={setDesc}
        />

        {/* Render the appropriate sub-component based on selected action type */}
        {actType &&
          React.createElement(
            actionTypeToComponent[actType].component,
            actionTypeToComponent[actType].props,
          )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            disabled={hasError}
            onClick={() => handleSave()}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ActionForm;
