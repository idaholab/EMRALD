import React from 'react';
import { useEffect, useState } from 'react';
import { useSignal } from '@preact/signals-react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../MainDetailsForm';
import { v4 as uuidv4 } from 'uuid';
import { Action } from '../../../types/Action';
import { ActionType, MainItemTypes } from '../../../types/ItemTypes';
import { emptyAction, useActionContext } from '../../../contexts/ActionContext';
import { useWindowContext } from '../../../contexts/WindowContext';

interface ActionFormProps {
  actionData?: Action;
}

const ActionForm: React.FC<ActionFormProps> = ({ actionData }) => {
  const { handleClose } = useWindowContext();
  const { updateAction, createAction } = useActionContext();
  const action = useSignal<Action>(actionData || emptyAction);
  const [name, setName] = useState<string>(actionData?.name || '');
  const [desc, setDesc] = useState<string>(actionData?.desc || '');
  const [actType, setActType] = useState<ActionType>(
    actionData?.actType || 'atTransition',
  );
  const actionTypeOptions = [
    { value: 'atTransition', label: 'Transition' },
    { value: 'CngVar_test', label: 'Change Var Value' },
    { value: 'at3DSimMsg', label: 'Ext. Sim Message' },
    { value: 'atRunExtApp', label: 'Run Application' },
  ];

  const handleSave = () => {
    actionData
      ? updateAction({
          ...action.value,
          name,
          desc,
          actType,
        })
      : createAction({
          ...action.value,
          id: uuidv4(),
          name,
          desc,
          actType,
        });
    handleClose();
  };

  useEffect(() => {
    if (actionData) {
      setActType(actionData.actType || '');
      setName(actionData.name || '');
      setDesc(actionData.desc || '');
    }
  }, [actionData]);

  return (
    <Container maxWidth="sm">
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
          setName={setName}
          desc={desc}
          setDesc={setDesc}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
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
    </Container>
  );
};

export default ActionForm;
