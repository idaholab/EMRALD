import React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MainDetailsForm from '../MainDetailsForm';
import { Action } from '../../../types/Action';
import { useWindowContext } from '../../../contexts/WindowContext';
import ActionDropTarget from '../../drag-and-drop/ActionDroppable';
import { useActionFormContext } from './ActionFormContext';
import { MainItemTypes } from '../../../types/ItemTypes';
import { Editor } from '@monaco-editor/react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useVariableContext } from '../../../contexts/VariableContext';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import ChangeVarValue from './FormFieldsByType/ChangeVarValue';
import RunApplication from './FormFieldsByType/RunApplication';
import Transition from './FormFieldsByType/Transition';

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
    mutuallyExclusive,
    variableName,
    codeVariables,
    actionTypeOptions,
    hasError,
    setName,
    setDesc,
    setActType,
    setMutuallyExclusive,
    setVariableName,
    addToUsedVariables,
    handleSave,
    initializeForm
  } = useActionFormContext();
  const { variableList } = useVariableContext();

  useEffect(() => {
    initializeForm(actionData);
  },[]);

  const { handleClose } = useWindowContext();

  return (
    <Box sx={{px: 3}}>
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

        {actType === 'atTransition' ? (
          <Transition />
        ) : (
          <></>
        )}
        {actType === 'atCngVarVal' ? (
          <ChangeVarValue />
        ) : (
          <></>
        )}
        {actType === 'at3DSimMsg' ? (
          <>Add 3D Sim Form Fields</>
        ) : (
          <></>
        )}
        {actType === 'atRunExtApp' ? (
          <RunApplication />
        ) : (
          <></>
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
