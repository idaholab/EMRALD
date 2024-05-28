import React from 'react';
import Button from '@mui/material/Button/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

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
  file: string;
  setFile: (value: string) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  label,
  file,
  setFile,
}) => {
  return (
    <Box display={'flex'} alignItems={'center'} mt={2}>
      <Button
        sx={{ maxWidth: 180 }}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<FileUploadIcon />}
      >
        {label}
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setFile(file ? file.name : '');
          }}
        />
      </Button>
      {file && (
        <Typography sx={{ ml: 3, fontSize: 18 }}>{file}</Typography>
      )}
    </Box>
  );
};

export default FileUploadComponent;
