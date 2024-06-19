import React from 'react';
import Button from '@mui/material/Button/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileUploadComponentProps {
  label: string;
  file: any;
  setFile: (value: any) => void;
  disabled?: boolean;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  label,
  file,
  setFile,
  disabled
}) => {
  const [content, setContent] = React.useState<any>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          try {
            console.log(event.target.result);
            const jsonContent = JSON.parse(event.target.result);
            setContent(jsonContent);  // Update JSON content state
          } catch (error) {
            console.error("Error parsing JSON file:", error);
          }
        }
      };
      reader.readAsText(file);
      setFile(file);
    } else {
      setContent(null);
      setFile(null);
    }
  };

  const handleClear = () => {
    setContent(null);
    setFile(null);
  };

  return (
    <Box display={'flex'} alignItems={'center'} mt={2}>
      <Button
        sx={{ maxWidth: 180 }}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        disabled={disabled}
        startIcon={<FileUploadIcon />}
      >
        {label}
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
        />
      </Button>
      {file && (
        <Typography sx={{ ml: 3, fontSize: 18 }}>{file.name}</Typography>
      )}
      {
        file && (
          <IconButton
            aria-label="close"
            onClick={handleClear}
            sx={{
              color: (theme) => theme.palette.grey[500],
              ml: 6,
            }}
          >
            <CloseIcon />
          </IconButton>
        )
      }
    </Box>
  );
};

export default FileUploadComponent;
