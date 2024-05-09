import React from 'react';
import Box from '@mui/material/Box/Box';
import DurationControl from 'react-duration-control';

interface DurationComponentProps {
  milliseconds: number;
  handleDurationChange: (value: number) => void;
  label?: string;
}
const DurationComponent: React.FC<DurationComponentProps> = ({
  milliseconds,
  handleDurationChange,
  label
}) => {
  return (
    <Box>
      <DurationControl
        className="custom-duration-control"
        label={label ? label : 'Duration'}
        pattern={'Days {dddd} Hours {hh} Minutes {mm} Seconds {ss}'}
        value={milliseconds}
        onChange={handleDurationChange}
        hideSpinner
      />
    </Box>
  );
};

export default DurationComponent;
