import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DropTargetComponent from '../../drag-and-drop/Droppable';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import { useWindowContext } from '../../../contexts/WindowContext';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { Diagram } from '../../../types/Diagram';
import { useAssembledData } from '../../../hooks/useAssembledData';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../MainDetailsForm';
import { DiagramType } from '../../../types/ItemTypes';

interface DiagramFormProps {
  diagramData?: Diagram;
}

const DiagramForm: React.FC<DiagramFormProps> = ({ diagramData }) => {
  const { handleClose, updateTitle } = useWindowContext();
  const { diagrams, updateDiagram, createDiagram } = useDiagramContext();
  const [diagramType, setDiagramType] = useState<DiagramType>(diagramData?.diagramType || 'dtSingle');
  const [diagramLabel, setDiagramLabel] = useState<string>(diagramData?.diagramLabel || 'plant');
  const [states, setStates] = useState<string[]>([]);
  const [name, setName] = useState<string>(diagramData?.name || '');
  const [desc, setDesc] = useState<string>(diagramData?.desc || '');
  const { assembledData } = useAssembledData();

  const handleSave = () => {
    updateTitle(diagramData?.name || '', name);
    const newDiagram = {
      id: uuidv4(),
      name,
      desc,
      diagramType,
      diagramLabel,
      states,
    };

    diagramData
      ? updateDiagram(assembledData, {
          id: diagramData.id,
          name,
          desc,
          diagramType,
          diagramLabel,
          states
        })
      : createDiagram(newDiagram);
    handleClose();
  };

  useEffect(() => {
    if (diagramData) {
      setDiagramType(diagramData.diagramType || '');
      setName(diagramData.name || '');
      setDesc(diagramData.desc || '');
    }
  }, [diagramData]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        {diagramData ? `Edit` : `Create`} Diagram
      </Typography>
      <form>
        <MainDetailsForm 
          type={diagramType}
          setType={setDiagramType}
          typeOptions={[
            {value: 'dtSingle', label: 'Single'},
            {value: 'dtMulti', label: 'Multi'},
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
      {/* <DropTargetComponent /> */}
    </Container>
  );
};

export default DiagramForm;
