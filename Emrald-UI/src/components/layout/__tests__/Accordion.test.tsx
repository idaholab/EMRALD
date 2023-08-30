import { render, fireEvent, screen } from '@testing-library/react';
import MenuAccordion from '../Accordion/Accordion';

test('MenuAccordion component renders correctly', () => {
  const { getByText } = render(<MenuAccordion panel="Diagrams" />);

  // Test that the accordion panel name is rendered
  const panelNameElement = getByText('Diagrams');
  expect(panelNameElement).toBeInTheDocument();
});
