import { NodeTimes } from './types';

/**
 * Check if the time configuration has a distribution.
 *
 * @param times - The time configuration to check.
 * @returns If the configuration has a distribution.
 */
export function hasDist(times: NodeTimes): boolean {
  return (
    typeof times.meanTime === 'number' && typeof times.stdDeviation === 'number'
  );
}

/**
 * Gets the key start/end time from any format of time configuration.
 *
 * @param times - The time configuration.
 * @returns The key start/end times.
 */
export function getKeyTimes(times: NodeTimes): number[] {
  const keyTimes = [times.startTime, times.endTime];
  if (times.meanTime && times.stdDeviation) {
    keyTimes.push(times.meanTime - times.stdDeviation);
    keyTimes.push(times.meanTime + times.stdDeviation);
  }
  return keyTimes.sort((a, b) => a - b);
}

/**
 * Gets the sum of passing each element in the array to the given function.
 *
 * @param arr - The array to sum.
 * @param fn - The value function.
 * @returns The sum of the values of items in the array.
 */
export function sum<T>(arr: T[], fn: (link: T) => number): number {
  let s = 0;
  arr.forEach((value) => {
    s += fn(value);
  });
  return s;
}
