import React, { useState } from 'react';
import { DurationComponent } from '../../../common';
import { useEventFormContext } from '../EventFormContext';
import dayjs from 'dayjs';

const Timer = () => {
  const { milliseconds, handleDurationChange } = useEventFormContext();

  return (
    <div>
      <DurationComponent milliseconds={milliseconds} handleDurationChange={handleDurationChange} />
    </div>
  );
};

export default Timer;
