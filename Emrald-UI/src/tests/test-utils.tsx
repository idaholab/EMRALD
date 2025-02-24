import { render, RenderOptions } from '@testing-library/react';
import 'jest-extended';
import EmraldContextWrapper from '../contexts/EmraldContextWrapper';
import React from 'react';

const customRender = (ui: React.ReactNode, options?: RenderOptions) => {
  render(ui, {
    wrapper: EmraldContextWrapper,
    ...options,
  });
};

export { customRender as render };
