import React from 'react';
import { useState } from 'react';
import { useSignal } from '@preact/signals-react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../../forms/MainDetailsForm';
import SingleValueGroups from './SingleValueGroups';
import { v4 as uuidv4 } from 'uuid';
import { Diagram } from '../../../types/Diagram';
import { DiagramType, MainItemTypes } from '../../../types/ItemTypes';
import {
  emptyDiagram,
  useDiagramContext,
} from '../../../contexts/DiagramContext';
import { useWindowContext } from '../../../contexts/WindowContext';

interface DiagramFormProps {
  diagramData?: Diagram;
}

const DiagramForm: React.FC<DiagramFormProps> = ({ diagramData }) => {
  const { handleClose, updateTitle } = useWindowContext();
  const { updateDiagram, createDiagram } = useDiagramContext();
  const diagram = useSignal<Diagram>(diagramData || emptyDiagram);
  const [name, setName] = useState<string>(diagramData?.name || '');
  const [desc, setDesc] = useState<string>(diagramData?.desc || '');
  const [diagramType, setDiagramType] = useState<DiagramType>(
    diagramData?.diagramType || 'dtSingle',
  );
  const diagramTypeOptions = [
    { value: 'dtSingle', label: 'Single' },
    { value: 'dtMulti', label: 'Multi' },
  ];

  const handleSave = () => {
    updateTitle(diagramData?.name || '', name);

    diagramData
      ? updateDiagram({
          ...diagram.value,
          name,
          desc,
          diagramType
        })
      : createDiagram({
          ...diagram.value,
          id: uuidv4(),
          name,
          desc,
          diagramType
        });
    handleClose();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        {diagramData ? `Edit` : `Create`} Diagram
      </Typography>
      <form>
        <MainDetailsForm
          itemType={MainItemTypes.Diagram}
          type={diagramType}
          setType={setDiagramType}
          typeOptions={diagramTypeOptions}
          name={name}
          setName={setName}
          desc={desc}
          setDesc={setDesc}
        />
        {/* <Box>
          <SingleValueGroups states={diagram.value.states} /> Maybe put back in the future
        </Box> */}
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

export default DiagramForm;
