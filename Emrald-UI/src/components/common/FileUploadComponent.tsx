import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Box, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { styled, type Theme } from '@mui/material/styles';
import { type ChangeEvent, useRef, useState } from 'react';

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
  fileName?: string;
  accept?: string;
}

export const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  label,
  disabled,
  fileName,
  accept,
  setFile,
  clearFile,
}) => {
  const [uploadedContent, setUploadedContent] = useState<File | null>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
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
    <Box display="flex" alignItems="center" mt={2}>
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
          aria-label={label}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
        />
      </Button>

      <Typography sx={{ ml: 3, fontSize: 18 }}>
        {uploadedContent?.name ?? fileName ?? ''}
      </Typography>

      {uploadedContent && (
        <IconButton
          aria-label="close"
          onClick={handleClear}
          sx={{
            color: (theme: Theme) => theme.palette.grey[500],
            ml: 6,
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
};
