import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { Action } from '../../../types/Action';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../../forms/MainDetailsForm';
import { useActionContext } from '../../../contexts/ActionContext';

interface ActionFormProps {
  actionData?: Action;
}

const ActionForm: React.FC<ActionFormProps> = ({ actionData }) => {
  const { handleClose } = useWindowContext();
  const { updateAction, createAction } = useActionContext();
  const [actType, setActType] = useState<string>(
    actionData?.actType || '',
  );
  const [name, setName] = useState<string>(actionData?.name || '');
  const [desc, setDesc] = useState<string>(actionData?.desc || '');

  const handleSave = () => {
    const newAction = {
      id: uuidv4(),
      actType,
      name,
      desc,
    };

    actionData
      ? updateAction({
          id: actionData.id,
          actType,
          name,
          desc,
        })
      : createAction(newAction);
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
          type={actType}
          setType={setActType}
          typeOptions={[
            {value: 'atTransition', label: 'Transition'},
            {value: 'CngVar_test', label: 'Change Var Value'},
            {value: 'at3DSimMsg', label: 'Ext. Sim Message'},
            {value: 'atRunExtApp', label: 'Run Application'},
          ]}
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

      <Typography variant="h6" mt={5}>
        Drop Components Here
      </Typography>
    </Container>
  );
};

export default ActionForm;
