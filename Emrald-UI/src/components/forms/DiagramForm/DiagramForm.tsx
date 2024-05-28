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
import { emptyDiagram, useDiagramContext } from '../../../contexts/DiagramContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { Alert, FormControl, TextField } from '@mui/material';
import { FormError } from '../FormError';

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
  const [error, setError] = useState<FormError>();

  const diagramTypeOptions = [
    { value: 'dtSingle', label: 'Single' },
    { value: 'dtMulti', label: 'Multi' },
  ];
  const [diagramLabel, setDiagramLabel] = useState<string>(diagramData?.diagramLabel || '');
  const { diagrams } = useDiagramContext();

  const handleSave = () => {
    if (!validate()) return;
    updateTitle(diagramData?.name || '', name);

    diagramData
      ? updateDiagram({
          ...diagram.value,
          name,
          desc,
          diagramType,
          diagramLabel,
        })
      : createDiagram({
          ...diagram.value,
          id: uuidv4(),
          name,
          desc,
          diagramType,
          diagramLabel: diagramLabel || 'Component',
        });
    handleClose();
  };
  const validate = () => {
    if (!name) {
      setError({ error: true, message: 'Name is required' });
      return false;
    }
    if (!diagramType) {
      setError({ error: true, message: 'Diagram type is required' });
      return false;
    }
    if (!diagramLabel) {
      setError({ error: true, message: 'Diagram label is required' });
      return false;
    }
    return true;
  };
  const reset = () => {};
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
          handleSave={handleSave}
          reset={reset}
          helperText={`${
            error
              ? 'A Logic Node with this name already exists'
              : name.length === 20
              ? 'Maximum 20 characters'
              : ''
          }`}
        >
          {/* <Box>
          <SingleValueGroups states={diagram.value.states} /> Maybe put back in
          the future
        </Box> */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
            <TextField
              label="Diagram Label"
              margin="normal"
              variant="outlined"
              size="small"
              sx={{ mb: 0 }}
              value={diagramLabel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiagramLabel(e.target.value)}
              fullWidth
            />
          </FormControl>
        </MainDetailsForm>
      </form>
    </Container>
  );
};

export default DiagramForm;
