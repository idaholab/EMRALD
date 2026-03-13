import moment from 'moment';

/**
 * Converts a string in scientific notation to a numeric value rounded to 10 decimal places.
 * If the input is not in scientific notation, or if there is an error, this function will return undefined.
 * @param value - The string to convert to a numeric value
 * @returns The numeric value rounded to 10 decimal places, or undefined if there is an error
 */
export function scientificToNumeric(value?: string) {
  try {
    // Regular expression to match a string in scientific notation
    if (
      value
      && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/.test(value)
    ) {
      // Convert scientific notation to numeric value
      return Number.parseFloat(value);
    }
  } catch {
    // Handle any errors (e.g., invalid input)
    console.error('Error converting scientific notation');
  }
}

/**
 * Converts a numeric value representing a duration to an ISO 8601 duration string.
 * If the input is not a number or if there is an error, this function will return undefined.
 * @param value - The numeric value to convert to an ISO 8601 duration string
 * @returns The ISO 8601 duration string
 */
export function convertToISOString(value: number) {
  try {
    const dur = moment.duration(value);

    const totalDays = Math.floor(dur.asDays());
    const remainingTime = dur.subtract(totalDays, 'days');
    const remainingHours = remainingTime.hours();
    const remainingMinutes = remainingTime.minutes();
    const remainingSeconds = remainingTime.seconds();

    let isoString = `P${totalDays.toString()}D`;

    if (remainingHours || remainingMinutes || remainingSeconds) {
      isoString += 'T';
      if (remainingHours) {
        isoString += `${remainingHours.toString()}H`;
      }
      if (remainingMinutes) {
        isoString += `${remainingMinutes.toString()}M`;
      }
      if (remainingSeconds) {
        isoString += `${remainingSeconds.toString()}S`;
      }
    }
    return isoString;
  } catch {
    // Handle any errors (e.g., invalid input)
    console.error('Error converting duration to ISO string'); // Log error to console
    return ''; // Return undefined to indicate that there was an error
  }
}

/**
 * For use in form context definitions. Cleans up unneeded and unused properties from a model item.
 */
export function cleanFormItem<T>(item: T, requiredProperties: (keyof T)[]) {
  const i = { ...item };
  for (const key in item) {
    if (!requiredProperties.includes(key) || item[key] === undefined) {
      delete i[key];
    }
  }
  return i;
}
