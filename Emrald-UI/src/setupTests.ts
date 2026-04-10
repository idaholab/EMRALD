import * as matchers from 'jest-extended';
import ResizeObserver from 'resize-observer-polyfill';
import { expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

expect.extend(matchers);

vi.stubGlobal('ResizeObserver', ResizeObserver);

vi.mock('html-to-image', () => {
  return {
    toPng: (_: HTMLElement, __: object) => {
      return 'mocked image';
    },
  };
});
