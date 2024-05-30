import React from 'react';
import { useState } from 'react';
import { useSignal } from '@preact/signals-react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../../forms/MainDetailsForm';
import { v4 as uuidv4 } from 'uuid';
import { Diagram } from '../../../types/Diagram';
import { DiagramType, MainItemTypes } from '../../../types/ItemTypes';
import { emptyDiagram, useDiagramContext } from '../../../contexts/DiagramContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { FormControl, TextField } from '@mui/material';
import { useAppData } from '../../../hooks/useAppData';

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
  const [hasError, setHasError] = useState<boolean>(false);

  const diagramTypeOptions = [
    { value: 'dtSingle', label: 'Single State (Evaluation)' },
    { value: 'dtMulti', label: 'Multi State' },
  ];
  const [diagramLabel, setDiagramLabel] = useState<string>(diagramData?.diagramLabel || '');
  const diagrams = useAppData().appData.value.DiagramList;

  const handleSave = () => {
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
  const reset = () => {};
  const handleNameChange = (newName: string) => {
    setHasError(diagrams.some((node) => node.name === newName));
    setName(newName);
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
          desc={desc}
          setDesc={setDesc}
          handleSave={handleSave}
          reset={reset}
          handleNameChange={handleNameChange}
          error={hasError}
          errorMessage="A Diagram with this name already exists."
          reqPropsFilled={name && diagramLabel ? true : false}
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
