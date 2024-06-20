import React, { useRef } from 'react';
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
  disabled?: boolean;
  setFile: (value: File | null) => void;
  clearFile?: () => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  label,
  disabled,
  setFile,
  clearFile
}) => {
  const [uploadedContent, setUploadedContent] = React.useState<File | null>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFile(file);
    setUploadedContent(file);
  };

  const handleClear = () => {
    setFile(null);
    setUploadedContent(null);
    if (clearFile) {
      clearFile();
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
        />
      </Button>
      {uploadedContent && (
        <Typography sx={{ ml: 3, fontSize: 18 }}>{uploadedContent.name}</Typography>
      )}
      {
        uploadedContent && (
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
