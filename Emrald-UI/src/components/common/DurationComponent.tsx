import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box/Box';

interface DurationComponentProps {
  milliseconds: number;
  handleDurationChange: (value: number) => void;
  label?: string;
}

interface DurationInputProps {
  label: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  padNum?: number;
}

const DurationInput: React.FC<DurationInputProps> = ({ label, value, onChange, padNum }) => {
  const [editing, setEditing] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const pad = padNum || 2;
  const displayValue = `${value}`.padStart(pad, '0');

  return (
    <>
      <span style={{ padding: 8 }} id={`${label}-label`}>
        {label}
      </span>
      {editing ? (
        <input
          aria-labelledby={`${label}-label`}
          value={value}
          onChange={onChange}
          ref={input}
          onBlur={() => setEditing(false)}
          style={{width: pad * 10}}
        />
      ) : (
        <b aria-labelledby={`${label}-label`} onClick={() => setEditing(true)}>{displayValue}</b>
      )}
    </>
  );
};

const DurationComponent: React.FC<DurationComponentProps> = ({
  milliseconds,
  handleDurationChange,
  label,
}) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const s = 1000;
  const m = 60 * s;
  const h = 60 * m;
  const d = 24 * h;

  function updateMs(days: number, hours: number, minutes: number, seconds: number) {
    handleDurationChange(days * d + hours * h + minutes * m + seconds * s);
  }

  useEffect(() => {
    let remaining = milliseconds;
    const days = Math.floor(remaining / d);
    setDays(days);
    remaining -= days * d;
    const hours = Math.floor(remaining / h);
    setHours(hours);
    remaining -= hours * h;
    const minutes = Math.floor(remaining / m);
    setMinutes(minutes);
    remaining -= minutes * m;
    setSeconds(remaining / s);
  }, [milliseconds]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px rgb(0, 0, 0, 0.4) solid',
        borderRadius: 1,
        boxSizing: 'content-box',
        padding: '12px',
        width: 'fit-content'
      }}
    >
      <span
        style={{
          transformOrigin: 'top left',
          transform: 'translate(0px, -22px)',
          background: 'white',
          position: 'absolute'
        }}
      >
        {label ? label : 'Duration'}
      </span>
      <div style={{transform: 'translate(-5px, 0px)'}}>
        <DurationInput
          label="Days"
          value={days}
          onChange={(e) => updateMs(Number(e.target.value), hours, minutes, seconds)}
          padNum={4}
        ></DurationInput>
        <DurationInput
          label="Hours"
          value={hours}
          onChange={(e) => updateMs(days, Number(e.target.value), minutes, seconds)}
        ></DurationInput>
        <DurationInput
          label="Minutes"
          value={minutes}
          onChange={(e) => updateMs(days, hours, Number(e.target.value), seconds)}
        ></DurationInput>
        <DurationInput
          label="Seconds"
          value={seconds}
          onChange={(e) => updateMs(days, hours, minutes, Number(e.target.value))}
        ></DurationInput>
      </div>
    </Box>
  );
};

export default DurationComponent;
