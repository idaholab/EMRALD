import dayjs from 'dayjs';

/**
 * Converts a string in scientific notation to a numeric value rounded to 10 decimal places.
 * If the input is not in scientific notation, or if there is an error, this function will return undefined.
 * @param {string|undefined} value - The string to convert to a numeric value
 * @returns {number|undefined} The numeric value rounded to 10 decimal places, or undefined if there is an error
 */
export const scientificToNumeric = (value: string | undefined): number | undefined => {
  try {
    // Regular expression to match a string in scientific notation
    const validInputRegex = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/;
    if (value && validInputRegex.test(value)) {
      // Convert scientific notation to numeric value
      const numericValue = parseFloat(value);
      return numericValue;
    }
  } catch {
    // Handle any errors (e.g., invalid input)
    console.error('Error converting scientific notation'); // Log error to console
    return undefined; // Return undefined to indicate that there was an error
  }
};

/**
 * Converts a numeric value representing a duration to an ISO 8601 duration string.
 * If the input is not a number or if there is an error, this function will return undefined.
 * @param {number} value - The numeric value to convert to an ISO 8601 duration string
 * @returns {string|undefined} The ISO 8601 duration string
 */
export const convertToISOString = (value: number): string => {
  try {
    const dur = dayjs.duration(value);

    const totalDays = Math.floor(dur.asDays());
    const remainingTime = dur.subtract(totalDays, 'days');
    const remainingHours = remainingTime.hours();
    const remainingMinutes = remainingTime.minutes();
    const remainingSeconds = remainingTime.seconds();

    let isoString = `P${totalDays.toString()}D`;

    if (remainingHours || remainingMinutes || remainingSeconds) {
      isoString += 'T';
      if (remainingHours) isoString += `${remainingHours.toString()}H`;
      if (remainingMinutes) isoString += `${remainingMinutes.toString()}M`;
      if (remainingSeconds) isoString += `${remainingSeconds.toString()}S`;
    }
    return isoString;
  } catch {
    // Handle any errors (e.g., invalid input)
    console.error('Error converting duration to ISO string'); // Log error to console
    return ''; // Return undefined to indicate that there was an error
  }
};

function isNumeric(stringOrNumber: string | number): boolean {
  return typeof stringOrNumber === 'number'
    ? !isNaN(stringOrNumber)
    : !isNaN(parseFloat(stringOrNumber)) && isFinite(parseFloat(stringOrNumber));
}

/**
 * Converts a time span string to an object containing the number of days, hours, minutes, and seconds.
 *
 * @param {string | null} tpStr - The time span string to convert. If null, defaults to 'P0DT0H0M0S'.
 * @return {{ days: number; hours: number; minutes: number; seconds: number; }} An object containing the number of days, hours, minutes, and seconds.
 */
/**
 * Converts a time span string to an object containing the number of days, hours, minutes, and seconds.
 *
 * @param {string | null} tpStr - The time span string to convert. If null, defaults to 'P0DT0H0M0S'.
 * @return {{ days: number; hours: number; minutes: number; seconds: number; }} An object containing the number of days, hours, minutes, and seconds.
 */
export const fromTimeSpanConverter = (
  tpStr: string | null,
): { days: number; hours: number; minutes: number; seconds: number } => {
  /**
   * Regular expression to match a time span string. Matches and captures the following:
   *   - 'P' for the start of the string
   *   - 'Y' for years
   *   - 'M' for months
   *   - 'W' for weeks
   *   - 'D' for days
   *   - 'T' for the start of the time component (if it exists)
   *   - 'H' for hours
   *   - 'M' for minutes
   *   - 'S' for seconds
   * If the time component is missing, the regex will still match and there will be missing matches.
   */
  const regex =
    /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/;
  const newTpStr = tpStr ?? 'P0DT0H0M0S'; // Set default if tpStr is null

  const matches = regex.exec(newTpStr); // Match the time span string

  if (matches === null) {
    // If the match failed
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }; // Return an object with all zeros
  }

  return {
    days: +parseFloat(matches[9]), // Parse and cast each match to a number
    hours: +parseFloat(matches[12]),
    minutes: +parseFloat(matches[14]),
    seconds: +parseFloat(matches[16]),
  };
};

interface TimeSpanProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Converts a TimeSpanProps object to a string representation of time span duration.
 *
 * @param {Required<Pick<TimeSpanProps, 'days' | 'hours' | 'minutes' | 'seconds'>>} ts - The TimeSpanProps object containing days, hours, minutes, and seconds.
 * @return {string} The string representation of the time span duration.
 */
export const toTimeSpanConverter = (
  ts?: Required<Pick<TimeSpanProps, 'days' | 'hours' | 'minutes' | 'seconds'>>,
): string => {
  // If null or undefined, return a default time span duration of 'P0DT0H0M0S'
  if (!ts) {
    return 'P0DT0H0M0S';
  }

  /**
   * Builds the time span string. If the value of a property is numeric, it will be included in the time span string.
   * The format of the time span string is: 'P'[number of days]'D'[number of hours]'H'[number of minutes]'M'[number of seconds]'S'
   */
  const duration =
    'P' +
    (isNumeric(ts.days) ? ts.days.toString() + 'D' : '') + // Add the number of days
    (isNumeric(ts.hours) || isNumeric(ts.minutes) || isNumeric(ts.seconds) ? 'T' : '') + // Add 'T' if there are any time values
    (isNumeric(ts.hours) ? ts.hours.toString() + 'H' : '') + // Add the number of hours
    (isNumeric(ts.minutes) ? ts.minutes.toString() + 'M' : '') + // Add the number of minutes
    (isNumeric(ts.seconds) ? ts.seconds.toString() + 'S' : ''); // Add the number of seconds

  // If there are no time values, return the default time span duration of 'P0DT0H0M0S'
  return duration === 'P' ? 'P0DT0H0M0S' : duration;
};

// Old UI Time Span Converters
/* 
  function toTimespan(ts) {
    if (!ts) {
        return 'P0DT0H0M0S';
    }
    var duration = 'P'
        + ((isNumeric(ts.days) && (ts.days !== '')) ? ts.days + 'D' : '')
        + (((isNumeric(ts.hours) && (ts.hours !== '')) || (isNumeric(ts.minutes) && (ts.minutes !== '')) || (isNumeric(ts.seconds) && (ts.seconds !== ''))) ? 'T' : '')
        + ((isNumeric(ts.hours) && (ts.hours !== '')) ? ts.hours + 'H' : '')
        + ((isNumeric(ts.minutes) && (ts.minutes !== '')) ? ts.minutes + 'M' : '')
        + ((isNumeric(ts.seconds) && (ts.seconds !== '')) ? ts.seconds + 'S' : '');
    duration = (duration === 'P') ? 'P0DT0H0M0S' : duration;
    return duration;
  }

  function isNumeric(stringOrNumber) {
    return isNaN(stringOrNumber)
        ? false
        : (parseFloat(stringOrNumber) ? true : (parseFloat(stringOrNumber) === 0 ? true : false));
  }

  function fromTimespan(tpStr) {
    var regex = /P((([0-9]*\.?[0-9]*)Y)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)W)?(([0-9]*\.?[0-9]*)D)?)?(T(([0-9]*\.?[0-9]*)H)?(([0-9]*\.?[0-9]*)M)?(([0-9]*\.?[0-9]*)S)?)?/;
    var newTpStr = tpStr;
    if (!tpStr) {
        newTpStr = 'P0DT0H0M0S';
    }
    var matches = newTpStr.match(regex);
    return {
        days: +parseFloat(matches[9]), hours: +parseFloat(matches[12]), minutes: +parseFloat(matches[14]), seconds: +parseFloat(matches[16])
    };
  }
*/
